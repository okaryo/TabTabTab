import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { GroupedTabs } from "../../model/GroupedTabs";
import TabItem from "./TabItem";
import { TabId } from "../../model/TabId";
import { TbWindows } from "../../model/Windows";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";

type GroupedTabListProps = {
  windows: TbWindows;
  tabs: GroupedTabs;
  onRemoveTab: (tabId: TabId) => Promise<void>;
};

const GroupedTabList = (props: GroupedTabListProps) => {
  const { windows, tabs, onRemoveTab } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpenStatus = () => setIsOpen(!isOpen);

  const tabComponents = tabs.map((tab) => {
    return (
      <TabItem
        key={tab.id.value}
        windows={windows}
        tab={tab}
        onRemoveTab={onRemoveTab}
        sx={{ width: 395 }}
      />
    );
  });

  let groupedTabLabel;
  if (props.tabs.name === "") {
    groupedTabLabel = (
      <ListItemIcon sx={{ flexGrow: 1 }}>
        <CircleIcon sx={{ color: `${props.tabs.colorCode}` }} />
      </ListItemIcon>
    );
  } else {
    groupedTabLabel = (
      <Typography
        variant="h6"
        component="h6"
        style={{
          display: "inline-block",
          padding: "2px 10px",
          borderRadius: "8px",
          backgroundColor: `${props.tabs.colorCode}`,
        }}
      >
        {props.tabs.name}
      </Typography>
    );
  }

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
            <IconButton edge="end" onClick={toggleOpenStatus}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton onClick={toggleOpenStatus} sx={{ height: 56 }}>
            {groupedTabLabel}
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>{tabComponents}</List>
        </Collapse>
      </List>
    </Stack>
  );
};

export default GroupedTabList;
