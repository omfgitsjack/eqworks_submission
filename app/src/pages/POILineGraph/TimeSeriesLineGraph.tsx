import moment from "moment";
import * as React from "react";
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const timeFormatter = (unixTime: number) =>
  moment(unixTime).format("HH:mm MMM Do");

interface Props<T> {
  dataKey: string;
  data: Array<T>;
}

const chartMargin = { top: 5, right: 30, left: 20, bottom: 5 };

function TimeSeriesLineGraph<T extends Object>({ data, dataKey }: Props<T>) {
  return (
    <ResponsiveContainer {...{ width: "99%" }}>
      <LineChart data={data} margin={chartMargin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          {...{
            dataKey: "date",
            type: "number",
            domain: ["auto", "auto"],
            name: "Time",
            tickFormatter: timeFormatter
          }}
        />
        <YAxis />

        <Tooltip
          {...{
            labelFormatter: label => timeFormatter(label as number)
          }}
        />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
        <Brush></Brush>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TimeSeriesLineGraph;
