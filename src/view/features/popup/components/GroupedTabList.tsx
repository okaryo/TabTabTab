import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { TabGroup } from "../../../../model/TabGroup";
import {
  collapseTabGroup,
  expandTabGroup,
} from "../../../../repository/TabGroupRepository";

import TabItem from "./TabItem";

type GroupedTabListProps = {
  tabs: TabGroup;
};

const GroupedTabList = (props: GroupedTabListProps) => {
  const { tabs } = props;
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(tabs.collapsed);
  const toggleCollapsedStatus = () => {
    const newCollapsed = !collapsed;
    if (newCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      collapseTabGroup(tabs.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expandTabGroup(tabs.id);
    }
    setCollapsed(newCollapsed);
  };

  const tabComponents = tabs.map((tab) => {
    return <TabItem key={tab.id} tab={tab} />;
  });

  return (
    <Stack direction="row">
      <Box
        style={{
          borderRight: `5px solid ${props.tabs.colorCode}`,
          borderRadius: "0 5px 5px 0",
        }}
      />
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={toggleCollapsedStatus}>
              {collapsed ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton onClick={toggleCollapsedStatus}>
            <Stack direction="row" spacing={1} alignItems="center">
              {tabs.name !== "" && (
                <Typography
                  variant="subtitle1"
                  component="h6"
                  sx={{ px: 1.25, py: 0.25 }}
                  style={{
                    display: "inline-block",
                    borderRadius: "8px",
                    backgroundColor: `${tabs.colorCode}`,
                    color: theme.palette.getContrastText(tabs.colorCode),
                  }}
                >
                  {tabs.name}
                </Typography>
              )}
              <Chip
                sx={{
                  backgroundColor: props.tabs.colorCode,
                  color: theme.palette.getContrastText(tabs.colorCode),
                }}
                label={tabs.length}
                size="small"
              />
            </Stack>
          </ListItemButton>
        </ListItem>
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <List disablePadding>{tabComponents}</List>
        </Collapse>
      </List>
    </Stack>
  );
};

export default GroupedTabList;
