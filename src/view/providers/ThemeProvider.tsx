import { ThemeProvider as MaterialThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { useContext, useMemo } from "react";

import { ThemeContext } from "../contexts/ThemeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;
  const { theme } = useContext(ThemeContext);

  const themePalette = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme,
      },
    });
  }, [theme]);

  return (
    <MaterialThemeProvider theme={themePalette}>
      {children}
    </MaterialThemeProvider>
  );
};

export default ThemeProvider;
