import { useCallback, useEffect, useState } from "react";

import { getTheme } from "../../../repository/ThemeRepository";

type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setState] = useState<Theme>();

  useEffect(() => {
    const initState = async () => {
      setState(await getTheme());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setState(theme);
  }, []);

  return { theme, setTheme };
};
