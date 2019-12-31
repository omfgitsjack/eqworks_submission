import React, { ReactElement } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
} from "@material-ui/core";

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MetricSelector({
  value,
  onChange
}: Props): ReactElement {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Metric</FormLabel>
      <RadioGroup
        aria-label="metric"
        name="metric"
        value={value}
        onChange={onChange}
      >
        <FormControlLabel
          value="impressions"
          control={<Radio color="primary" />}
          label="Impressions"
          labelPlacement="start"
        />
        <FormControlLabel
          value="clicks"
          control={<Radio color="primary" />}
          label="Clicks"
          labelPlacement="start"
        />
        <FormControlLabel
          value="revenue"
          control={<Radio color="primary" />}
          label="Revenue"
          labelPlacement="start"
        />
      </RadioGroup>
    </FormControl>
  );
}
