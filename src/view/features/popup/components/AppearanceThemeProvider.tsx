import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import { getPopupElementScaleSetting } from "../../../../repository/SettingsRepository";
import { ModeContext } from "../../../contexts/ModeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const AppearanceThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;
  const { mode } = useContext(ModeContext);

  const [scale, setScale] = useState(100);
  useEffect(() => {
    const initState = async () => {
      setScale(await getPopupElementScaleSetting());
    };
    initState();
  }, []);

  const themePalette = useMemo(() => {
    const defaultTheme = createTheme();
    const defaultTabMinHeight = 48;
    const defaultTabsMinHeight = 48;
    const defaultToolbarMinHeight = 56;
    const defaultChipHeight = 22;

    return createTheme({
      palette: {
        mode,
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
        fontSize: defaultTheme.typography.fontSize * (scale / 100),
      },
      components: {
        MuiTab: {
          styleOverrides: {
            root: {
              minHeight: defaultTabMinHeight * (scale / 100),
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              minHeight: defaultTabsMinHeight * (scale / 100),
            },
          },
        },
        MuiToolbar: {
          styleOverrides: {
            root: {
              minHeight: defaultToolbarMinHeight * (scale / 100),
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              height: defaultChipHeight * (scale / 100),
            },
          },
        },
      },
    });
  }, [mode, scale]);

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

export default AppearanceThemeProvider;