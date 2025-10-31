import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
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

  const themePalette = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: themeColorPaletteBy(themeColor, mode),
        ...tabGroupColorPalette(mode),
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
  }, [mode, themeColor]);

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
