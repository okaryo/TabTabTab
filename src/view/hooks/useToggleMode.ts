import { useCallback, useContext } from "react";
import { updateMode } from "../../data/repository/ThemeRepository";
import { Mode, ModeContext } from "../contexts/ModeContext";

export const useToggleMode = (): ((mode: Mode) => Promise<void>) => {
  const { setMode } = useContext(ModeContext);

  const toggleTheme = useCallback(
    async (mode: Mode) => {
      await updateMode(mode);
      setMode(mode);
    },
    [setMode],
  );

  return toggleTheme;
};
