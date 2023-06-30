import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import React from "react";

import { getPopupElementScaleSetting } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/Theme";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const PopupThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;
  const { theme } = useContext(ThemeContext);

  const [scale, setScale] = useState(100);
  useEffect(() => {
    const initState = async () => {
      setScale(await getPopupElementScaleSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  console.log(scale);

  const themePalette = useMemo(() => {
    const defaultTheme = createTheme();

    return createTheme({
      palette: {
        mode: theme,
      },
      typography: {
        fontSize: defaultTheme.typography.fontSize * (scale / 100),
      },
    });
  }, [theme, scale]);

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

export default PopupThemeProvider;
