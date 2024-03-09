import {
  Mode,
  ThemeColor,
  defaultMode,
  defaultThemeColor,
} from "../../model/Theme";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const getMode = async (): Promise<Mode> => {
  const mode = await ChromeLocalStorage.getMode();
  if (!mode) return defaultMode;

  return mode;
};

export const updateMode = (mode: Mode): Promise<void> => {
  return ChromeLocalStorage.updateMode(mode);
};

export const getThemeColor = async (): Promise<ThemeColor> => {
  const color = await ChromeLocalStorage.getThemeColor();
  if (!color) return defaultThemeColor;

  return color;
};

export const updateThemeColor = async (color: ThemeColor): Promise<void> => {
  return await ChromeLocalStorage.updateThemeColor(color);
};

export const addListenerOnChangeThemeColor = (
  callback: (color: ThemeColor) => void,
): ChromeLocalStorage.ChangeListener => {
  return ChromeLocalStorage.addListenerOnChangeThemeColor(callback);
};

export const removeListenerOnChangeThemeColor = (
  listener: ChromeLocalStorage.ChangeListener,
) => {
  ChromeLocalStorage.removeListenerOnChangeThemeColor(listener);
};
