import { PopupSize, defaultPopupSize } from "../model/PopupSize";

import { ChromeLocalStorage } from "./ChromeStorage";

export const getPopupSizeSetting = async (): Promise<PopupSize> => {
  const setting = await ChromeLocalStorage.getPopupSizeSetting();
  if (!setting) return defaultPopupSize;

  return { height: setting.height, width: setting.width };
};

export const updatePopupSizeSetting = (popupSize: PopupSize): Promise<void> => {
  return ChromeLocalStorage.updatePopupSizeSetting(popupSize);
};

export const getPopupElementScaleSetting = async (): Promise<number> => {
  const setting = await ChromeLocalStorage.getPopupElementScaleSetting();
  if (!setting) return 80;

  return setting;
};

export const updatePopupElementScaleSetting = (
  scale: number,
): Promise<void> => {
  return ChromeLocalStorage.updatePopupElementScaleSetting(scale);
};

export const navigateToOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
