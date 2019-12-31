import React, { ReactElement } from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
interface Props {}

export default function LoadingSpinner({}: Props): ReactElement {
  return (
    <Root>
      <CircularProgress {...{ size: 50 }}></CircularProgress>
    </Root>
  );
}
