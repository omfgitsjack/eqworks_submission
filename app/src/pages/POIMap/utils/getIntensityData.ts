import { HourlyStat } from "../../../dataSources/stats/HourlyStat";

export const getIntensityData = (data: Array<HourlyStat>, metric: string) => {
  const intensityData = data.reduce<{ [key: string]: number }>((acc, cur) => {
    const existing = acc[cur.poi_id] || 0;
    const next = Number.parseFloat(existing + (cur as any)[metric]);

    return {
      ...acc,
      [cur.poi_id]: next
    };
  }, {});

  const { max, min } = Object.values(intensityData).reduce(
    (acc, cur) => {
      return {
        max: Math.max(acc.max, cur),
        min: Math.min(acc.min, cur)
      };
    },
    { max: Number.NEGATIVE_INFINITY, min: Number.POSITIVE_INFINITY }
  );

  return { intensityData, min, max };
};
