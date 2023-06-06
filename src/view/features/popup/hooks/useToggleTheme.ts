import { useCallback, useContext } from "react";

import { updateTheme } from "../../../../repository/ThemeRepository";
import { ThemeContext } from "../../../contexts/Theme";

type Theme = "light" | "dark";

export const useToggleTheme = (): ((theme: Theme) => Promise<void>) => {
  const { setTheme } = useContext(ThemeContext);

  const toggleTheme = useCallback(
    async (theme: Theme) => {
      await updateTheme(theme);
      setTheme(theme);
    },
    [setTheme]
  );

  return toggleTheme;
};
