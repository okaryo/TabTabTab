import { TabCleaner, defaultTabCleaner } from "../model/TabCleaner";

import {
  ChromeLocalStorage,
  TabCleanerSettingStorageObject,
} from "./ChromeStorage";

export const getTabCleanerSetting = async (): Promise<TabCleaner> => {
  const { tab_cleaner_setting: setting } = (await chrome.storage.local.get(
    ChromeLocalStorage.TAB_CLEANER_SETTING_KEY,
  )) as TabCleanerSettingStorageObject;
  if (!setting) return defaultTabCleaner;

  return {
    enabled: setting.isEnabled,
    duration: setting.duration,
    durationUnit: setting.durationUnit,
  };
};

export const updateTabCleanerSetting = (
  tabCleaner: TabCleaner,
): Promise<void> => {
  return chrome.storage.local.set({
    [ChromeLocalStorage.TAB_CLEANER_SETTING_KEY]: {
      isEnabled: tabCleaner.enabled,
      duration: tabCleaner.duration,
      durationUnit: tabCleaner.durationUnit,
    },
  });
};
