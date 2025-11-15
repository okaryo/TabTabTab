import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type React from "react";
import { useContext } from "react";
import { ModeContext, ModeProvider } from "./contexts/ModeContext";
import {
  ThemeColorContext,
  ThemeColorProvider,
} from "./contexts/ThemeColorContext";
import { WindowsProvider } from "./contexts/WindowsContext";
import Header from "./views/options/Header";
import Overview from "./views/options/Overview";
import { tabGroupColorPalette } from "./views/shared/resources/tabGroupColorPalette";
import { themeColorPaletteBy } from "./views/shared/resources/themeColorPalette";

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useContext(ModeContext);
  const { themeColor } = useContext(ThemeColorContext);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const actualMode =
    mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode;
  const themePalette = createTheme({
    palette: {
      mode: actualMode,
      primary: themeColorPaletteBy(themeColor, actualMode),
      ...tabGroupColorPalette(actualMode),
    },
  });

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

const OptionsApp = () => {
  return (
    <ModeProvider>
      <ThemeColorProvider>
        <MuiThemeProvider>
          <CssBaseline />
          <Header />

          <WindowsProvider>
            <Overview />
          </WindowsProvider>
        </MuiThemeProvider>
      </ThemeColorProvider>
    </ModeProvider>
  );
};

export default OptionsApp;
