import moment from "moment";
import React, { ReactElement } from "react";
import styled from "styled-components";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import { HourlyStat } from "../../dataSources/stats/HourlyStat";
import useHourlyStatsData from "../../dataSources/stats/useHourlyStatsData";
import DateRangePicker from "./components/DateRangePicker";
import MetricSelector from "./components/MetricSelector";
import ClusterMap from "./components/ClusterMap";
import { getIntensityData } from "./utils/getIntensityData";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px;
`;

const nullDateMetadata = { min: null, max: null };
const useDateMetadata = (data: Array<HourlyStat> | null) => {
  const [metadataCache, setCache] = React.useState<{
    min: Date | null;
    max: Date | null;
  }>(nullDateMetadata);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    let min = moment(),
      max = moment.unix(0);

    for (let i = 0; i < data.length; i++) {
      const { date } = data[i];

      const mDate = moment(date);

      min = mDate.isBefore(min) ? mDate : min;
      max = mDate.isAfter(max) ? mDate : max;
    }

    setCache({ min: min.toDate(), max: max.toDate() });
  }, [data]);

  return metadataCache;
};

interface Props {}

export default function POIMap({}: Props): ReactElement {
  const { data, loading, error } = useHourlyStatsData();
  const [metric, setMetric] = React.useState("impressions");
  const dateMetadata = useDateMetadata(data);

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleMetricChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetric((event.target as HTMLInputElement).value);
  };

  if (!!data) {
    const { intensityData, min, max } = getIntensityData(data, metric);

    return (
      <Root>
        <ControlsSection>
          <MetricSelector
            {...{ value: metric, onChange: handleMetricChange }}
          ></MetricSelector>
          <DateRangePicker
            {...{
              startDate: startDate || dateMetadata.min,
              endDate: endDate || dateMetadata.max,
              onEndDateChange: setEndDate,
              onStartDateChange: setStartDate,
              minDate: dateMetadata.min as Date,
              maxDate: dateMetadata.max as Date
            }}
          ></DateRangePicker>
          The greener the value, the higher the metric
        </ControlsSection>
        <ClusterMap {...{ intensityData, min, max }}></ClusterMap>
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
}
