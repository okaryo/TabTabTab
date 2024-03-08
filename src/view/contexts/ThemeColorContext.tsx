import { createContext, useEffect, useState } from "react";
import { ThemeColor, defaultThemeColor } from "../../model/Theme";
import { getThemeColor } from "../../repository/ThemeRepository";

type ThemeColorContextType = {
  themeColor: ThemeColor;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColor>>;
};

export const ThemeColorContext = createContext<ThemeColorContextType>({
  themeColor: null,
  setThemeColor: () => {},
});

export const ThemeColorProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [themeColor, setThemeColor] = useState<ThemeColor>(defaultThemeColor);

  useEffect(() => {
    const initState = async () => {
      setThemeColor(await getThemeColor());
    };
    initState();
  }, []);

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};
