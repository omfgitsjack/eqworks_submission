import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import styled from "styled-components";
import { Routes } from "./navigation/constants/routes";
import NavigationDrawer from "./navigation/NavigationDrawer/NavigationDrawer";
import POIMap from "./pages/POIMap/POIMap";
import POITable from "./pages/POITable/POITable";
import POILineGraph from "./pages/POILineGraph/POILineGraph";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

const Root = styled.div`
  display: flex;
  flex: 1;
`;

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});

export default function PermanentDrawerLeft() {
  const [route, setRoute] = React.useState(Routes.TABLE);

  return (
    <ThemeProvider {...{ theme: lightTheme }}>
      <Router>
        <Root>
          <ThemeProvider {...{ theme: darkTheme }}>
            <NavigationDrawer {...{ route, setRoute }} />
          </ThemeProvider>
          <Switch>
            <Route path={`/${Routes.TABLE}`} component={POITable}></Route>
            <Route path={`/${Routes.GRAPH}`} component={POILineGraph}></Route>
            <Route path={`/${Routes.MAP}`} component={POIMap}></Route>
          </Switch>
        </Root>
      </Router>
    </ThemeProvider>
  );
}
