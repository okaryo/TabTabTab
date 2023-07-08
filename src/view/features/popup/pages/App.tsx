import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/Theme";
import { useTheme } from "../../../hooks/useTheme";
import PopupThemeProvider from "../components/ThemeProvider";
import { WindowsContext } from "../contexts/Windows";
import { useWindows } from "../hooks/useWindows";

import Home from "./Home";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [popupSizeState, setPopupSizeState] = useState<PopupSize>(
    PopupSize.default(),
  );
  useEffect(() => {
    const initState = async () => {
      setPopupSizeState(await getPopupSizeSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  return (
    <ThemeContext.Provider value={useTheme()}>
      <PopupThemeProvider>
        <WindowsContext.Provider value={useWindows()}>
          <Box
            style={{
              maxHeight: popupSizeState.height,
              width: popupSizeState.width,
              overflowY: "auto",
            }}
          >
            {children}
          </Box>
        </WindowsContext.Provider>
      </PopupThemeProvider>
    </ThemeContext.Provider>
  );
};

const BasePage = () => {
  return (
    <>
      <CssBaseline />
      <Home />
    </>
  );
};

export default function App() {
  return (
    <Provider>
      <BasePage />
    </Provider>
  );
}
