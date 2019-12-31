import React from "react";

interface DataHook<T> {
  data: null | Array<T>;
  error: null | string;
  loading: boolean;
}

/**
 * Queries the endpoint and provides state of the request
 *
 * @param endpoint endpoint to fetch data from
 */
const useData = <T,>(endpoint: string): DataHook<T> => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  if (!error && !loading && !data) {
    setLoading(true);

    const getData = async () => {
      try {
        const response = await fetch(endpoint);
        const results = await response.json();

        setData(results);
        setError(null);
        setLoading(false);
      } catch (err) {
        setData(null);
        setError(err.message);
        setLoading(false);
      }
    };

    getData();
  }

  return { data, error, loading };
};

export default useData;
