import { TextField } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import useHourlyStatsData from "../../dataSources/stats/useHourlyStatsData";
import StatsDataTable from "./components/StatsDataTable";
import { useFuzzyResults } from "./components/utils/useFuzzyResults";

const Root = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 16px;
  margin-top: 0;
`;

const TableContainer = styled.div`
  display: flex;
  flex: 1;
`;

const Toolbar = styled.div`
  margin: 16px 0;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

interface IPOITableProps {}
const POITable: React.FunctionComponent<IPOITableProps> = props => {
  const { data, loading, error } = useHourlyStatsData();
  const [searchText, setSearchText] = React.useState("");

  const filteredResults = useFuzzyResults(data, searchText);

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    [setSearchText]
  );

  if (!!filteredResults) {
    return (
      <Root>
        <Toolbar>
          <StyledTextField
            {...{
              label: "Search for points of interests",
              variant: "outlined",
              onChange: handleSearchChange,
              placeholder: "Search for a Point of Interest...",
              value: searchText
            }}
          />
        </Toolbar>
        <TableContainer>
          <StatsDataTable {...{ data: filteredResults }}></StatsDataTable>
        </TableContainer>
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

export default POITable;
