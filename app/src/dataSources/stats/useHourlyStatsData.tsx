import useData from "../useData";
import { HourlyStat } from "./HourlyStat";

const useHourlyStatsData = () => {
  const url = "http://localhost:5555/stats/hourly";

  const { data, error, loading } = useData<HourlyStat>(url);

  return { data, error, loading };
};

export default useHourlyStatsData;
