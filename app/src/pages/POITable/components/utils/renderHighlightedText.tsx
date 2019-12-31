import React from "react";
import { FormattedMatches } from "./useFuzzyResults";

export const renderHighlightedText = (
  str: string,
  matches?: Array<FormattedMatches>
) => {
  if (!matches) {
    return str;
  }

  const indices: Array<[number, number]> = [];
  matches.forEach(match => {
    match.indices.forEach(index => indices.push(index));
  });

  let i = 0;

  let output = [];

  for (let index of indices) {
    const [start, end] = index;

    const prefix = str.slice(i, start);
    const highlightedText = <mark>{str.slice(start, end + 1)}</mark>;

    i = end + 1;

    output.push(prefix, highlightedText);
  }

  output.push(str.slice(i));

  return output.filter(val => val !== "");
};
