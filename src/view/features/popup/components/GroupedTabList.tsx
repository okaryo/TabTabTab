import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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

import { TabGroup } from "../../../../model/TabContainer";
import { useCollapseTabGroup } from "../hooks/useCollapseTabGroup";
import { useExpandTabGroup } from "../hooks/useExpandTabGroup";

import TabItem from "./TabItem";
import { SortableItem } from "./TabList";

type GroupedTabListProps = {
  tabGroup: TabGroup;
};

const GroupedTabList = (props: GroupedTabListProps) => {
  const { tabGroup } = props;
  const theme = useTheme();
  const collapseTabGroup = useCollapseTabGroup();
  const expandTabGroup = useExpandTabGroup();
  const toggleCollapsedStatus = () => {
    const newCollapsed = !tabGroup.collapsed;
    if (newCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      collapseTabGroup(tabGroup.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expandTabGroup(tabGroup.id);
    }
  };

  return (
    <Stack id={tabGroup.id.toString()} direction="row">
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <Stack direction="row">
          <Box
            style={{
              borderRight: `5px solid ${tabGroup.color.code}`,
              borderRadius: "0 5px 5px 0",
            }}
          />
          <Stack sx={{ width: "calc(100% - 5px)" }}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={toggleCollapsedStatus}>
                  {tabGroup.collapsed ? <ExpandMore /> : <ExpandLess />}
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
                        backgroundColor: `${tabGroup.color.code}`,
                        color: theme.palette.getContrastText(
                          tabGroup.color.code,
                        ),
                      }}
                    >
                      {tabGroup.name}
                    </Typography>
                  )}
                  <Chip
                    sx={{
                      backgroundColor: props.tabGroup.color.code,
                      color: theme.palette.getContrastText(tabGroup.color.code),
                    }}
                    label={tabGroup.children.length}
                    size="small"
                  />
                </Stack>
              </ListItemButton>
            </ListItem>
            <Collapse in={!tabGroup.collapsed} timeout="auto" unmountOnExit>
              <List disablePadding>
                <SortableContext
                  id={tabGroup.id.toString()}
                  items={tabGroup.children.map((child) => child.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {tabGroup.children.map((tab) => (
                    <SortableItem key={tab.id} id={tab.id.toString()}>
                      <TabItem tab={tab} />
                    </SortableItem>
                  ))}
                </SortableContext>
              </List>
            </Collapse>
          </Stack>
        </Stack>
      </List>
    </Stack>
  );
};

export default GroupedTabList;
