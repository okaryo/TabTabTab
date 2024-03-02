import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";
import { getMode } from "../../repository/ThemeRepository";

export type Mode = "light" | "dark";

type ModeContextType = {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
};

export const ModeContext = createContext<ModeContextType>({
  mode: null,
  setMode: () => {},
});

export const ModeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [mode, setMode] = useState<Mode>();

  useEffect(() => {
    const initState = async () => {
      setMode(await getMode());
    };
    initState();
  }, []);

  const themePalette = useMemo(() => {
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={themePalette}>{children}</ThemeProvider>
    </ModeContext.Provider>
  );
};
