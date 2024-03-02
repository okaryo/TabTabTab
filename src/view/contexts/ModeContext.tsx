import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";
import { Mode } from "../../model/Mode";
import { getMode } from "../../repository/ThemeRepository";

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
