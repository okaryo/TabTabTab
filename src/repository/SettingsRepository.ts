import { PopupSize } from "../model/settings/PopupSize";
import { TabCleaner } from "../model/settings/TabCleaner";
import {
  ChromeLocalStorage,
  PopupSizeSettingStoredData,
  TabCleanerSettingStoredData,
} from "./ChromeStorage";

export const getTabCleanerSetting = async (): Promise<TabCleaner> => {
  const { tab_cleaner_setting } = (await chrome.storage.local.get(
    ChromeLocalStorage.TAB_CLEANER_SETTING_KEY
  )) as TabCleanerSettingStoredData;
  if (!tab_cleaner_setting) return new TabCleaner(false, 5, "day");

  return new TabCleaner(
    tab_cleaner_setting.isEnabled,
    tab_cleaner_setting.duration,
    tab_cleaner_setting.durationUnit
  );
};

export const updateTabCleanerSetting = (
  TabCleaner: TabCleaner
): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.TAB_CLEANER_SETTING_KEY]: {
      isEnabled: TabCleaner.isEnabled,
      duration: TabCleaner.duration,
      durationUnit: TabCleaner.durationUnit,
    },
  });
};

export const getPopupSizeSetting = async (): Promise<PopupSize> => {
  const { popup_size_setting } = (await chrome.storage.local.get(
    ChromeLocalStorage.POPUP_SIZE_SETTING_KEY
  )) as PopupSizeSettingStoredData;
  if (!popup_size_setting) return PopupSize.default();

  return new PopupSize(popup_size_setting.height, popup_size_setting.width);
};

export const updatePopupSizeSetting = (PopupSize: PopupSize): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.POPUP_SIZE_SETTING_KEY]: {
      height: PopupSize.height,
      width: PopupSize.width,
    },
  });
};

export const navigateToOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
