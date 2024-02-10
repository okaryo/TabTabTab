import { createContext } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
});
