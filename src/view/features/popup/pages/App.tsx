import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";

import { ThemeContext } from "../../../contexts/Theme";
import { useTheme } from "../../../hooks/useTheme";
import PopupThemeProvider from "../components/ThemeProvider";
import { WindowsContext } from "../contexts/Windows";
import { useWindows } from "../hooks/useWindows";

import Home from "./Home";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeContext.Provider value={useTheme()}>
      <PopupThemeProvider>
        <WindowsContext.Provider value={useWindows()}>
          {children}
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
  useEffect(() => {
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        return;
      }

      window.close();
    });
  }, []);

  return (
    <Provider>
      <BasePage />
    </Provider>
  );
}
