import React from "react";
import Supercluster from "supercluster";
import { POI } from "../../../dataSources/pois/POI";

export const useSuperCluster = (
  data: Array<POI> | null,
  intensityData: {
    [poiId: string]: number;
  },
  min: number,
  max: number
) => {
  const [supercluster, setSupercluster] = React.useState<Supercluster | null>(
    null
  );

  React.useEffect(() => {
    if (data) {
      const instance = new Supercluster({
        radius: 40,
        maxZoom: 16
      });

      instance.load(
        data.map(val => {
          const absoluteIntensity = intensityData[val.poi_id];

          // get a value between 0 and 1, so we can properly reflect the relative intensity
          const relativeIntensity = (absoluteIntensity - min) / (max - min);

          return {
            type: "Feature",
            id: val.poi_id,
            geometry: { type: "Point", coordinates: [val.lon, val.lat] },
            properties: {
              intensity: relativeIntensity
            }
          };
        })
      );

      setSupercluster(instance);
    }
  }, [data, intensityData, min, max]);

  return supercluster;
};
