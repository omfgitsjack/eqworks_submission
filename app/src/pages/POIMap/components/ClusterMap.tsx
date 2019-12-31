import React, { ReactElement } from "react";
import styled from "styled-components";
import usePOIData from "../../../dataSources/pois/usePOIData";
import LoadingSpinner from "../../../common/LoadingSpinner/LoadingSpinner";
import GoogleMapReact from "google-map-react";
import Supercluster from "supercluster";
import { Paper } from "@material-ui/core";
import Marker from "./Marker";
import { useSuperCluster } from "./useSuperCluster";

const MAP_BROWSER_KEY = "";

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const DEFAULT_CENTER = { lat: 43.280213911394526, lng: -79.26124130165609 };
const DEFAULT_ZOOM = 9;

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapState {
  center: Coordinate;
  zoom: number;
  bounds: {
    ne: Coordinate;
    nw: Coordinate;
    sw: Coordinate;
    se: Coordinate;
  } | null;
}

interface Props {
  intensityData: {
    [poiId: string]: number;
  };
  min: number;
  max: number;
}

const ClusterMap = React.memo(({ intensityData, min, max }: Props) => {
  const [mapState, setMapState] = React.useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    bounds: null
  });

  const handleMapChange = React.useCallback(
    ({ center, bounds, zoom }) => {
      setMapState({ center, zoom, bounds });
    },
    [setMapState]
  );

  const { data, loading, error } = usePOIData();

  const supercluster = useSuperCluster(data, intensityData, min, max);

  const clusters =
    !!supercluster && !!mapState.bounds
      ? supercluster.getClusters(
          [
            mapState.bounds.sw.lng,
            mapState.bounds.sw.lat,
            mapState.bounds.ne.lng,
            mapState.bounds.ne.lat
          ],
          mapState.zoom
        )
      : [];

  if (!!clusters) {
    const { center, zoom } = mapState;

    return (
      <GoogleMapReact
        {...{
          bootstrapURLKeys: {
            key: MAP_BROWSER_KEY
          },
          center: center,
          zoom: zoom,
          onChange: handleMapChange
        }}
      >
        {clusters.map(
          ({
            properties,
            id,
            geometry: {
              coordinates: [lng, lat]
            }
          }) => {
            if (properties?.cluster) {
              return (
                <Marker
                  {...{
                    lat,
                    lng,
                    key: id,
                    label: properties.point_count_abbreviated,
                    isCluster: true
                  }}
                ></Marker>
              );
            } else {
              return (
                <Marker
                  {...{ lat, lng, key: id, intensity: properties.intensity }}
                ></Marker>
              );
            }
          }
        )}
      </GoogleMapReact>
    );
  }

  if (loading) {
    return (
      <Root>
        <LoadingSpinner></LoadingSpinner>
      </Root>
    );
  }

  return <Root>Error encountered: {error}</Root>;
});

export default ClusterMap;
