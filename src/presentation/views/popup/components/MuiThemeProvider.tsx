import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useMemo } from "react";
import { ModeContext } from "../../../contexts/ModeContext";
import { ThemeColorContext } from "../../../contexts/ThemeColorContext";
import { tabGroupColorPalette } from "../../shared/resources/tabGroupColorPalette";
import { themeColorPaletteBy } from "../../shared/resources/themeColorPalette";

type MuiThemeProviderProps = {
  children: React.ReactNode;
};

const MuiThemeProvider = (props: MuiThemeProviderProps) => {
  const { children } = props;
  const { mode } = useContext(ModeContext);
  const { themeColor } = useContext(ThemeColorContext);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const actualMode =
    mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode;

  const themePalette = useMemo(() => {
    return createTheme({
      palette: {
        mode: actualMode,
        primary: themeColorPaletteBy(themeColor, actualMode),
        ...tabGroupColorPalette(actualMode),
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 10000,
          md: 10000,
          lg: 10000,
          xl: 10000,
        },
      },
      typography: {
        fontSize: 12,
      },
      components: {
        MuiTab: {
          styleOverrides: {
            root: {
              minHeight: 36,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              minHeight: 36,
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              minHeight: 42,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              height: 16,
            },
          },
        },
      },
    });
  }, [actualMode, themeColor]);

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
