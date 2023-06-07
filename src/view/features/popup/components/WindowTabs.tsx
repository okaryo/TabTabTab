import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import React, { useContext } from "react";

import t from "../../../../i18n/Translations";
import { WindowsContext } from "../contexts/Windows";

import WindowTab from "./WindowTab";

type WindowTabsProps = {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

const WindowTabs = (props: WindowTabsProps) => {
  const { selectedIndex, onSelectIndex } = props;
  const { windows } = useContext(WindowsContext);

  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    onSelectIndex(newValue);
  };

  const unfocusedWindows = windows.unfocusedWindows.map((window, index) => {
    return (
      <WindowTab
        key={window.id.value}
        label={`${t.window}${index + 1}`}
        tabCount={window.tabCount}
      />
    );
  });

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={selectedIndex}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
      >
        <WindowTab
          label={t.currentWindow}
          tabCount={windows.currentWindow?.tabCount ?? 0}
        />
        {unfocusedWindows}
      </Tabs>
    </Box>
  );
};

export default WindowTabs;
