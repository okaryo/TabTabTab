import { createContext, useEffect, useState } from "react";
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

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
