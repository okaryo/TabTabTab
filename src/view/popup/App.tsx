import React, { useState, useEffect } from "react";
import { TbWindows } from "../../model/Windows";
import { Box } from "@mui/system";
import { CssBaseline } from "@mui/material";
import Header from "./Header";
import WindowTabs from "./WindowTabs";
import TabList from "./TabList";
import { TabId } from "../../model/TabId";
import { getWindows } from "../../repository/WindowsRepository";
import { removeTab } from "../../repository/TabsRepository";
import { PopupSize } from "../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../repository/SettingsRepository";

export default function App() {
  const [windowsState, setWindowsState] = useState(TbWindows.empty());
  const [popupSizeState, setPopupSizeState] = useState<PopupSize>(null);
  useEffect(() => {
    const initState = async () => {
      setWindowsState(await getWindows());
      setPopupSizeState(await getPopupSizeSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const onRemoveTab = async (tabId: TabId) => {
    await removeTab(tabId);
    const newWindows = windowsState.removeTabBy(tabId);
    setWindowsState(newWindows);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const unfocusedWindowsTabList = windowsState.unfocusedWindows.map(
    (window, index) => {
      return (
        selectedIndex === index + 1 && (
          <TabList
            windows={windowsState}
            tabs={window.tabs}
            onRemoveTab={onRemoveTab}
          />
        )
      );
    }
  );

  const focusedWindowsTabList = selectedIndex === 0 && (
    <TabList
      windows={windowsState}
      tabs={windowsState.focusedWindowTabs}
      onRemoveTab={onRemoveTab}
    />
  );

  if (popupSizeState === null) return <></>;

  return (
    <Box
      style={{
        maxHeight: popupSizeState.height,
        width: popupSizeState.width,
        overflowY: "auto",
        boxSizing: "content-box",
      }}
    >
      <CssBaseline />
      <Box>
        <Header />
        <WindowTabs
          currentWindow={windowsState.currentWindow}
          unfocusedWindows={windowsState.unfocusedWindows}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
        />
        {focusedWindowsTabList}
        {unfocusedWindowsTabList}
      </Box>
    </Box>
  );
}
