import { DurationUnit } from "../model/settings/TabCleaner";

export class ChromeLocalStorage {
  static readonly TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  static readonly POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  static readonly POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  static readonly THEME_KEY = "theme";
  static readonly STORED_TAB_GROUPS_KEY = "stored_tab_groups";
}

export class ChromeSessionStorage {
  static readonly LAST_ACTIVATED_AT_KEY = "last_activated_at";
  static readonly RECENT_ACTIVE_TABS_KEY = "recent_active_tabs";
}

export type TabCleanerSettingStorageObject = {
  [ChromeLocalStorage.TAB_CLEANER_SETTING_KEY]: {
    isEnabled: boolean;
    duration: number;
    durationUnit: DurationUnit;
  };
};

export type PopupSizeSettingStorageObject = {
  [ChromeLocalStorage.POPUP_SIZE_SETTING_KEY]: {
    height: number;
    width: number;
  };
};

export type PopupElementScaleSettingStorageObject = {
  [ChromeLocalStorage.POPUP_ELEMENT_SCALE_SETTING_KEY]: number;
};

type Theme = "light" | "dark";
export type ThemeStorageObject = {
  [ChromeLocalStorage.THEME_KEY]: Theme;
};

type SerializedStoredTab = {
  type: "tab";
  internalUid: string;
  title: string;
  url: string;
  favIconUrl: string | null;
};
type SerializedStoredTabGroup = {
  type: "tabGroup";
  internalUid: string;
  storedAt: string;
  name: string;
  color: string;
  children: SerializedStoredTab[];
};
export type StoredTabGroupsObject = {
  [ChromeLocalStorage.STORED_TAB_GROUPS_KEY]: SerializedStoredTabGroup[];
};

type DateString = string;
type StoredLastActivatedAt = {
  [tabId: string]: DateString;
};
export type LastActivatedAtStorageObject = {
  [ChromeSessionStorage.LAST_ACTIVATED_AT_KEY]: StoredLastActivatedAt;
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
  [ChromeSessionStorage.RECENT_ACTIVE_TABS_KEY]: SerializedTab[];
};
