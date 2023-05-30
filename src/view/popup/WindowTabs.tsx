import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import React from "react";

import { TbWindow } from "./../../model/Window";
import { TbWindows } from "./../../model/Windows";
import WindowTab from "./WindowTab";

type WindowTabsProps = {
  selectedIndex: number;
  currentWindow: TbWindow;
  unfocusedWindows: TbWindows;
  onSelectIndex: (index: number) => void;
};

const WindowTabs = (props: WindowTabsProps) => {
  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    props.onSelectIndex(newValue);
  };

  const unfocusedWindows = props.unfocusedWindows.map((window, index) => {
    return (
      <WindowTab
        key={window.id.value}
        label={`Window${index + 1}`}
        tabCount={window.tabCount}
      />
    );
  });

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={props.selectedIndex}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
      >
        <WindowTab
          label="CurrentWindow"
          tabCount={props.currentWindow?.tabCount ?? 0}
        />
        {unfocusedWindows}
      </Tabs>
    </Box>
  );
};

export default WindowTabs;
