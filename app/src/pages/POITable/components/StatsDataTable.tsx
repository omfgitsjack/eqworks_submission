import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow
} from "@material-ui/core";
import moment from "moment";
import * as React from "react";
import styled from "styled-components";
import s from "underscore.string";
import TablePaginationControls from "./TablePaginationControls";
import { renderHighlightedText } from "./utils/renderHighlightedText";
import { HourlyStat } from "../../../dataSources/stats/HourlyStat";
import { FilteredResult } from "./utils/useFuzzyResults";

const StyledTable = styled(Table)`
  border: 1px solid #424242;
`;

const Text = styled.span<{ bold?: boolean }>`
  color: black;
  font-weight: ${props => (props.bold ? "bold" : "normal")};
  font-size: 13px;
`;

const titles = [
  "Point of Interest",
  "date",
  "impressions",
  "clicks",
  "revenue"
];

const PAGE_SIZE = 10;

const StatsDataTable = React.memo(
  ({ data }: { data: Array<FilteredResult<HourlyStat>> }) => {
    const [page, setPage] = React.useState(0);

    // Whenever our data changes, we need to reset our page back to 1.
    React.useEffect(() => {
      setPage(0);
    }, [data]);

    const handleChangePage = React.useCallback(
      (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
      },
      [setPage]
    );

    const paginatedData = data.slice(PAGE_SIZE * page, PAGE_SIZE * (page + 1));

    return (
      <StyledTable stickyHeader size="small">
        <TableHead>
          <TableRow>
            {titles.map((row, i) => (
              <TableCell {...{ key: i }}>
                <Text bold>{s.humanize(row)}</Text>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map(({ item: row, matches }) => {
            const date = moment(row.date).add(row.hour, "hours");
            const impressions = row.impressions;
            const clicks = row.clicks;
            const revenue = Number.parseInt(row.revenue).toFixed(2);
            const name = renderHighlightedText(row.name, matches);

            return (
              <TableRow
                {...{ key: [name, date.toDate().toISOString()].join(".") }}
              >
                <TableCell>
                  <Text>{name}</Text>
                </TableCell>
                <TableCell>
                  <Text>{date.format("L h:mma")}</Text>
                </TableCell>
                <TableCell>
                  <Text>{impressions}</Text>
                </TableCell>
                <TableCell>
                  <Text>{clicks}</Text>
                </TableCell>
                <TableCell>
                  <Text>${revenue}</Text>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              colSpan={3}
              count={data.length}
              rowsPerPageOptions={[PAGE_SIZE]}
              rowsPerPage={PAGE_SIZE}
              page={page}
              onChangePage={handleChangePage}
              ActionsComponent={TablePaginationControls}
            />
          </TableRow>
        </TableFooter>
      </StyledTable>
    );
  }
);

export default StatsDataTable;
