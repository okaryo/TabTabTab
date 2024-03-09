import { createContext, useEffect, useState } from "react";
import {
  addListenerOnChangeMode,
  getMode,
  removeListenerOnChangeMode,
} from "../../data/repository/ThemeRepository";
import { Mode } from "../../model/Theme";

type ModeContextType = {
  mode: Mode;
};

export const ModeContext = createContext<ModeContextType>({
  mode: null,
});

export const ModeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [mode, setMode] = useState<Mode>();

  useEffect(() => {
    const initState = async () => {
      setMode(await getMode());
    };
    initState();

    const listenerOnChange = addListenerOnChangeMode((newValue: Mode) =>
      setMode(newValue),
    );

    return () => removeListenerOnChangeMode(listenerOnChange);
  }, []);

  return (
    <ModeContext.Provider value={{ mode }}>{children}</ModeContext.Provider>
  );
};
