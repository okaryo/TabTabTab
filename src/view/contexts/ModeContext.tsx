import { createContext, useEffect, useState } from "react";
import { getMode } from "../../data/repository/ThemeRepository";
import { Mode } from "../../model/Theme";

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

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
