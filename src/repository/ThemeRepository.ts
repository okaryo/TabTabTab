import { ChromeLocalStorage, ThemeStorageObject } from "./ChromeStorage";

type Theme = "light" | "dark";

export const getTheme = async (): Promise<Theme> => {
  const { theme } = (await chrome.storage.local.get(
    ChromeLocalStorage.THEME_KEY,
  )) as ThemeStorageObject;
  if (!theme) return "light";

  return theme as Theme;
};

export const updateTheme = (theme: Theme): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.THEME_KEY]: theme,
  });
};
