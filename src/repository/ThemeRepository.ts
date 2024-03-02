import { Mode, defaultMode } from "../model/Mode";
import { ChromeLocalStorage } from "./ChromeStorage";

export const getMode = async (): Promise<Mode> => {
  const mode = await ChromeLocalStorage.getMode();
  if (!mode) return defaultMode;

  return mode;
};

export const updateMode = (mode: Mode): Promise<void> => {
  return ChromeLocalStorage.updateMode(mode);
};
