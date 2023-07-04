import CircleIcon from "@mui/icons-material/Circle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { GroupedTabs } from "../../../../model/GroupedTabs";

import TabItem from "./TabItem";

type GroupedTabListProps = {
  tabs: GroupedTabs;
};

const GroupedTabList = (props: GroupedTabListProps) => {
  const { tabs } = props;
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpenStatus = () => setIsOpen(!isOpen);

  const tabComponents = tabs.map((tab) => {
    return <TabItem key={tab.id.value} tab={tab} />;
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
        sx={{ px: 1.25, py: 0.25 }}
        style={{
          display: "inline-block",
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
          <ListItemButton onClick={toggleOpenStatus}>
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
