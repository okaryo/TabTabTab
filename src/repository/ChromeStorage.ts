import { DurationUnit } from "../model/settings/TabCleaner";

export type TabCleanerSettingStoredData = {
  tab_cleaner_setting: {
    isEnabled: boolean;
    duration: number;
    durationUnit: DurationUnit;
  };
};
export type PopupSizeSettingStoredData = {
  popup_size_setting: {
    height: number;
    width: number;
  };
};

type DateString = string;
type StoredLastActivatedAt = {
  [tabId: string]: DateString;
};
export type LastActivatedAtStoredData = {
  last_activated_at: StoredLastActivatedAt;
};

export class ChromeLocalStorage {
  static readonly TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  static readonly POPUP_SIZE_SETTING_KEY = "popup_size_setting";
}

export class ChromeSessionStorage {
  static readonly LAST_ACTIVATED_AT_KEY = "last_activated_at";
}
