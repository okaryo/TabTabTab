import { type PopupSize, defaultPopupSize } from "../../model/PopupSize";
import {
  type ToolbarSetting,
  defaultToolbarSetting,
} from "../../model/ToolbarSetting";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

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

export const getToolbarSetting = async (): Promise<ToolbarSetting> => {
  const setting = await ChromeLocalStorage.getToolbarSetting();
  if (!setting) return defaultToolbarSetting;

  return setting;
};

export const navigateToOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};

export const openSidePanel = async () => {
  const currentWindow = await chrome.windows.getCurrent();
  return chrome.sidePanel.open({ windowId: currentWindow.id });
};
