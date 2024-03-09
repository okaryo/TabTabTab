import { createContext, useEffect, useState } from "react";
import {
  addListenerOnChangeThemeColor,
  getThemeColor,
  removeListenerOnChangeThemeColor,
} from "../../data/repository/ThemeRepository";
import { ThemeColor, defaultThemeColor } from "../../model/Theme";

type ThemeColorContextType = {
  themeColor: ThemeColor;
};

export const ThemeColorContext = createContext<ThemeColorContextType>({
  themeColor: null,
});

export const ThemeColorProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [themeColor, setThemeColor] = useState<ThemeColor>(defaultThemeColor);

  useEffect(() => {
    const initState = async () => {
      setThemeColor(await getThemeColor());
    };
    initState();

    const listenerOnChange = addListenerOnChangeThemeColor(
      (newValue: ThemeColor) => setThemeColor(newValue),
    );

    return () => removeListenerOnChangeThemeColor(listenerOnChange);
  }, []);

  return (
    <ThemeColorContext.Provider value={{ themeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};
