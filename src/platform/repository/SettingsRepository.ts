import { defaultPopupSize, type PopupSize } from "../../model/PopupSize";
import {
  defaultToolbarSetting,
  type ToolbarSetting,
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
