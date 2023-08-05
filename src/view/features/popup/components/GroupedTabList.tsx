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
import { useState } from "react";

import { TabGroup } from "../../../../model/TabGroup";
import {
  collapseTabGroup,
  expandTabGroup,
} from "../../../../repository/TabGroupRepository";

import TabItem from "./TabItem";
import { SortableItem } from "./TabList";

type GroupedTabListProps = {
  tabGroup: TabGroup;
};

const GroupedTabList = (props: GroupedTabListProps) => {
  const { tabGroup } = props;
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(tabGroup.collapsed);
  const toggleCollapsedStatus = () => {
    const newCollapsed = !collapsed;
    if (newCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      collapseTabGroup(tabGroup.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expandTabGroup(tabGroup.id);
    }
    setCollapsed(newCollapsed);
  };

  return (
    <SortableItem id={tabGroup.id.toString()}>
      <Stack direction="row">
        <Box
          style={{
            borderRight: `5px solid ${tabGroup.colorCode}`,
            borderRadius: "0 5px 5px 0",
          }}
        />
        <List sx={{ width: "100%" }} disablePadding>
          <Stack>
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
                  {tabGroup.name !== "" && (
                    <Typography
                      variant="subtitle1"
                      component="h6"
                      sx={{ px: 1.25, py: 0.25 }}
                      style={{
                        display: "inline-block",
                        borderRadius: "8px",
                        backgroundColor: `${tabGroup.colorCode}`,
                        color: theme.palette.getContrastText(
                          tabGroup.colorCode,
                        ),
                      }}
                    >
                      {tabGroup.name}
                    </Typography>
                  )}
                  <Chip
                    sx={{
                      backgroundColor: props.tabGroup.colorCode,
                      color: theme.palette.getContrastText(tabGroup.colorCode),
                    }}
                    label={tabGroup.length}
                    size="small"
                  />
                </Stack>
              </ListItemButton>
            </ListItem>
          </Stack>
          <Collapse in={!collapsed} timeout="auto" unmountOnExit>
            <List disablePadding>
              {tabGroup.tabs.map((tab) => (
                <TabItem tab={tab} />
              ))}
            </List>
          </Collapse>
        </List>
      </Stack>
    </SortableItem>
  );
};

export default GroupedTabList;
