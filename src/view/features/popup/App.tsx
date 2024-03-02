import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from "react";
import { ModeProvider } from "../../contexts/ModeContext";
import { WindowsProvider } from "../../contexts/WindowsContext";
import Home from "./components/Home";
import MuiThemeProvider from "./components/MuiThemeProvider";

const App = ({ sidePanel = false }) => {
  useEffect(() => {
    if (sidePanel) return;

    const closePopupOnOtherWindowFocused = () => {
      chrome.windows.onFocusChanged.addListener((windowId) => {
        const isNoWindowFocused = windowId === chrome.windows.WINDOW_ID_NONE;
        if (isNoWindowFocused) return;

        window.close();
      });
    };
    closePopupOnOtherWindowFocused();
  }, [sidePanel]);

  return (
    <ModeProvider>
      <MuiThemeProvider>
        <WindowsProvider>
          <CssBaseline />
          <Home sidePanel={sidePanel} />
        </WindowsProvider>
      </MuiThemeProvider>
    </ModeProvider>
  );
};

export default App;
