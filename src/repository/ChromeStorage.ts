import { DurationUnit } from "../model/settings/TabCleaner";

export type TabCleanerSettingStorageObject = {
  tab_cleaner_setting: {
    isEnabled: boolean;
    duration: number;
    durationUnit: DurationUnit;
  };
};

export type PopupSizeSettingStorageObject = {
  popup_size_setting: {
    height: number;
    width: number;
  };
};

export type PopupElementScaleSettingStorageObject = {
  popup_element_scale: number;
};

type Theme = "light" | "dark";
export type ThemeStorageObject = {
  theme: Theme;
};

type DateString = string;
type StoredLastActivatedAt = {
  [tabId: string]: DateString;
};
export type LastActivatedAtStorageObject = {
  last_activated_at: StoredLastActivatedAt;
};

export type SerializedTab = {
  id: number;
  groupId: number | null;
  windowId: number | null;
  title: string;
  url: string;
  favIconUrl: string | null;
  highlighted: boolean;
  audible: boolean;
  pinned: boolean;
  lastActivatedAt: DateString | null;
};
export type RecentActiveTabsStorageObject = {
  recent_active_tabs: SerializedTab[];
};

export class ChromeLocalStorage {
  static readonly TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  static readonly POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  static readonly POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  static readonly THEME_KEY = "theme";
}

export class ChromeSessionStorage {
  static readonly LAST_ACTIVATED_AT_KEY = "last_activated_at";
  static readonly RECENT_ACTIVE_TABS_KEY = "recent_active_tabs";
}
