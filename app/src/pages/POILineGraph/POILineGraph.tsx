import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Brush,
  Tooltip
} from "recharts";
import styled from "styled-components";
import useHourlyStatsData from "../../dataSources/stats/useHourlyStatsData";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import TimeSeriesLineGraph from "./TimeSeriesLineGraph";

const Title = styled.h2``;

const Root = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: scroll;
`;

const GraphSection = styled.div`
  margin: 40px 40px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

interface IPOILineGraphProps {}
const POILineGraph: React.FunctionComponent<IPOILineGraphProps> = props => {
  const { data, loading, error } = useHourlyStatsData();

  const formattedData = React.useMemo(() => {
    if (data != null) {
      return data.map(row => ({
        impressions: row.impressions,
        clicks: row.clicks,
        revenue: row.revenue,
        date: moment(row.date)
          .add(row.hour, "hours")
          .toDate()
          .getTime()
      }));
    }

    return null;
  }, [data]);

  if (!!formattedData) {
    return (
      <Root>
        <GraphSection>
          <Title>Impressions</Title>
          <TimeSeriesLineGraph
            {...{
              data: formattedData,
              dataKey: "impressions"
            }}
          ></TimeSeriesLineGraph>
        </GraphSection>
      </Root>
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
};

export default POILineGraph;
