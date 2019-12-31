import React, { ReactElement } from "react";
import { Slider } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker
} from "@material-ui/pickers";
import styled from "styled-components";

import MomentUtils from "@date-io/moment";
import { Moment } from "moment";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const Root = styled.div`
  display: flex;
  flex-direction: column;

  margin: 0 40px;
`;

interface Props {
  startDate: Date | null;
  endDate: Date | null;

  onEndDateChange: (date: Date) => void;
  onStartDateChange: (date: Date) => void;

  minDate: Date;
  maxDate: Date;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  maxDate,
  minDate
}: Props): ReactElement {
  const handleStartDateChange = React.useCallback(
    (date: MaterialUiPickersDate) => {
      onStartDateChange(date?.toDate() || minDate);
    },
    [onStartDateChange]
  );

  const handleEndDateChange = React.useCallback(
    (date: MaterialUiPickersDate) => {
      onEndDateChange(date?.toDate() || maxDate);
    },
    [onEndDateChange]
  );

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Root>
        <KeyboardDatePicker
          disableToolbar
          variant="dialog"
          margin="normal"
          id="date-picker-inline"
          label="Start Date"
          maxDate={maxDate}
          minDate={minDate}
          defaultValue={minDate}
          value={startDate}
          onChange={handleStartDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="dialog"
          margin="normal"
          id="date-picker-inline"
          label="End Date"
          maxDate={maxDate}
          minDate={minDate}
          defaultValue={maxDate}
          value={endDate}
          onChange={handleEndDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </Root>
    </MuiPickersUtilsProvider>
  );
}
