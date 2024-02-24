import { PopupSize, defaultPopupSize } from "../model/PopupSize";

import {
  ChromeLocalStorage,
  PopupElementScaleSettingStorageObject,
  PopupSizeSettingStorageObject,
} from "./ChromeStorage";

export const getPopupSizeSetting = async (): Promise<PopupSize> => {
  const { popup_size_setting: setting } = (await chrome.storage.local.get(
    ChromeLocalStorage.POPUP_SIZE_SETTING_KEY,
  )) as PopupSizeSettingStorageObject;
  if (!setting) return defaultPopupSize;

  return { height: setting.height, width: setting.width };
};

export const updatePopupSizeSetting = (popupSize: PopupSize): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.POPUP_SIZE_SETTING_KEY]: {
      height: popupSize.height,
      width: popupSize.width,
    },
  });
};

export const getPopupElementScaleSetting = async (): Promise<number> => {
  const { popup_element_scale: setting } = (await chrome.storage.local.get(
    ChromeLocalStorage.POPUP_ELEMENT_SCALE_SETTING_KEY,
  )) as PopupElementScaleSettingStorageObject;
  if (!setting) return 80;

  return setting;
};

export const updatePopupElementScaleSetting = (
  scale: number,
): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.POPUP_ELEMENT_SCALE_SETTING_KEY]: scale,
  });
};

export const navigateToOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
