import { TabCleaner } from "../model/settings/TabCleaner";
import {
  ChromeLocalStorage,
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

export const navigateToOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
