import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MapIcon from "@material-ui/icons/Map";
import TableChartIcon from "@material-ui/icons/TableChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import React from "react";
import { Routes } from "../constants/routes";
import { makeStyles, Theme, createStyles } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import s from "underscore.string";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    }
  })
);

const renderIcon = (text: Routes): React.ReactElement => {
  switch (text) {
    case Routes.GRAPH:
      return <TimelineIcon></TimelineIcon>;
    case Routes.MAP:
      return <MapIcon />;
    case Routes.TABLE:
      return <TableChartIcon />;
  }
};

interface NavigationDrawerProps {}

const NavigationDrawer = React.memo<NavigationDrawerProps>(({}) => {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <List>
        {Object.values(Routes).map(text => (
          <ListItem
            {...{
              button: true,
              selected: `/${text}` === location.pathname,
              key: text,
              onClick: () => {
                history.push(`/${text}`);
              }
            }}
          >
            <ListItemIcon>{renderIcon(text)}</ListItemIcon>
            <ListItemText primary={s.humanize(text)} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
});

export default NavigationDrawer;
