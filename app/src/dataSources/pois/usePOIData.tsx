import useData from "../useData";
import { POI } from "./POI";

const usePOIData = () => {
  const url = "http://localhost:5555/poi";

  const { data, error, loading } = useData<POI>(url);

  return { data, error, loading };
};

export default usePOIData;
