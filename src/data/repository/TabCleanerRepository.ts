import { TabCleaner, defaultTabCleaner } from "../../model/TabCleaner";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const getTabCleanerSetting = async (): Promise<TabCleaner> => {
  const setting = await ChromeLocalStorage.getTabCleanerSetting();
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
  return ChromeLocalStorage.updateTabCleanerSetting(tabCleaner);
};
