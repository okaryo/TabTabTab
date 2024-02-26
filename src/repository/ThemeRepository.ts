import { ChromeLocalStorage } from "./ChromeStorage";

type Theme = "light" | "dark";

export const getTheme = async (): Promise<Theme> => {
  const theme = await ChromeLocalStorage.getTheme();
  if (!theme) return "light";

  return theme;
};

export const updateTheme = (theme: Theme): Promise<void> => {
  return ChromeLocalStorage.updateTheme(theme);
};
