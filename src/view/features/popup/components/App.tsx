import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import ThemeProvider from "../../../components/ThemeProvider";
import { ThemeContext } from "../../../contexts/Theme";
import { useTheme } from "../../../hooks/useTheme";
import { WindowsContext } from "../contexts/Windows";
import { useWindows } from "../hooks/useWindows";

import Header from "./Header";
import TabList from "./TabList";
import WindowTabs from "./WindowTabs";

export default function App() {
  const [popupSizeState, setPopupSizeState] = useState<PopupSize>(
    PopupSize.default()
  );
  useEffect(() => {
    const initState = async () => {
      setPopupSizeState(await getPopupSizeSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <WindowsContext.Provider value={useWindows()}>
          <Box
            style={{
              maxHeight: popupSizeState.height,
              width: popupSizeState.width,
              overflowY: "auto",
            }}
          >
            <CssBaseline />
            <Box>
              <Header />
              <WindowTabs
                selectedIndex={selectedIndex}
                onSelectIndex={setSelectedIndex}
              />
              <TabList selectedWindowIndex={selectedIndex} />
            </Box>
          </Box>
        </WindowsContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
