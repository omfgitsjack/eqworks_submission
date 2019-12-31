import React from "react";
import Fuse from "fuse.js";

export interface FilteredResult<T> {
  item: T;
  matches?: Array<FormattedMatches>;
}

export interface FormattedMatches {
  indices: Array<[number, number]>;
  value: string;
}

export const useFuzzyResults = <T,>(
  data: Array<T> | null,
  searchText: string
) => {
  const [filteredResults, setFilteredResults] = React.useState<Array<
    FilteredResult<T>
  > | null>(null);

  // fuse is used to perform fuzzy searching on a specific dataset.
  const [fuse, setFuse] = React.useState<Fuse<T, {}> | null>(null);

  // If our dataset changes, we'll need to reset our fuse instance with the correct dataset.
  React.useEffect(() => {
    if (!!data) {
      const options = {
        findAllMatches: true,
        includeMatches: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["name"]
      };
      const nextFuse = new Fuse(data, options);

      setFuse(nextFuse);
    }
  }, [data]);

  React.useEffect(() => {
    if (!fuse) {
      return;
    }

    const results = fuse.search(searchText);
    setFilteredResults((results as unknown) as Array<FilteredResult<T>>);
  }, [searchText, fuse]);

  return searchText === ""
    ? data?.map(row => ({ item: row, match: null }))
    : filteredResults;
};
