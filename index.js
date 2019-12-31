const express = require("express");
const pg = require("pg");
const path = require("path");
const app = express();
const cors = require("cors");
const requestIp = require("request-ip");

// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
  pool
    .query(req.sqlQuery)
    .then(r => {
      return res.json(r.rows || []);
    })
    .catch(next);
};

// Relax CORS constraint in dev mode.
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

const createInMemoryCountStore = (window, max) => {
  let cache = {};

  const recordRequest = ip => {
    if (!cache[ip]) {
      cache[ip] = 1;
    } else {
      cache[ip]++;
    }

    return cache[ip];
  };

  const clearWindow = () => {
    // XXX: There's a possibility of allowing 2*max requests across window ms.
    // Users can wait until the end of the window before sending max requests, and then they can send another
    // max request at the start of the window.
    // Ideas around this:
    // 1. We could potentially enforce some kind of a max request per second rule to avoid spikes.
    // 2. Store the distribution of requests over the current window, when setting up the next window if the distribution is leaning towards
    // the end of the window, we could move a portion of that load over to the next window (so it'd start off with a higher count as opposed to 0).
    cache = {};
  };

  const interval = setInterval(() => {
    clearWindow();
  }, window);

  return {
    recordRequest,
    destroy: () => {
      clearInterval(interval);
    }
  };
};

// window, max-requests,
function createRateLimiter(window, max) {
  const store = createInMemoryCountStore(window, max);

  return (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);

    const count = store.recordRequest(clientIp);
    if (count > max) {
      return res.status(429).send();
    } else {
      return next();
    }
  };
}

const rateLimit = createRateLimiter(5000, 1);

app.get(
  "/events/hourly",
  rateLimit,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/events/daily",
  rateLimit,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/hourly",
  rateLimit,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue, name, A.poi_id
    FROM public.hourly_stats as A
    JOIN public.poi as B ON A.poi_id = B.poi_id
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/daily",
  rateLimit,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/poi",
  rateLimit,
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

app.use(express.static(path.join(__dirname, "app", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "app", "build", "index.html"));
});

app.listen(process.env.PORT || 5555, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on("uncaughtException", err => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
