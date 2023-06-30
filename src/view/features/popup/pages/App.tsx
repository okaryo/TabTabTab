import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect, useContext } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/Theme";
import { useTheme } from "../../../hooks/useTheme";
import PopupThemeProvider from "../components/ThemeProvider";
import { Page, PageContext } from "../contexts/Page";
import { WindowsContext } from "../contexts/Windows";
import { useWindows } from "../hooks/useWindows";

import Home from "./Home";
import Search from "./Search";

const Provider = ({ children }: { children: React.ReactNode }) => {
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
  const [page, setPage] = useState<Page>("home");

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
            <PageContext.Provider value={{ page, setPage }}>
              {children}
            </PageContext.Provider>
          </Box>
        </WindowsContext.Provider>
      </PopupThemeProvider>
    </ThemeContext.Provider>
  );
};

const BasePage = () => {
  const { page } = useContext(PageContext);

  return (
    <>
      <CssBaseline />
      {page === "home" && <Home />}
      {page === "search" && <Search />}
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
