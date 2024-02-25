import { DurationUnit } from "../model/TabCleaner";
import { TabGroupSetting } from "../model/TabGroupSetting";

export namespace ChromeLocalStorage {
  export const TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  export const POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  export const POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  export const THEME_KEY = "theme";
  export const STORED_WINDOWS_KEY = "stored_windows";
  export const STORED_TAB_GROUPS_KEY = "stored_tab_groups";
  export const TAB_GROUP_SETTING_KEY = "tab_group_setting";
}

export namespace ChromeSessionStorage {
  export const LAST_ACTIVATED_AT_KEY = "last_activated_at";
  export const RECENT_ACTIVE_TABS_KEY = "recent_active_tabs";
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

type SerializedStoredWindow = {
  type: "window";
  internalUid: string;
  name: string;
  storedAt: string;
  children: (SerializedStoredTabContainerInWindow | SerializedStoredTab)[];
};
type SerializedStoredTabContainerInWindow =
  | SerializedStoredPinned
  | Omit<SerializedStoredTabGroup, "storedAt">;
type SerializedStoredTabContainerBase = {
  type: "pinned" | "tabGroup";
  internalUid: string;
  children: SerializedStoredTab[];
};
type SerializedStoredPinned = SerializedStoredTabContainerBase & {
  type: "pinned";
};
type SerializedStoredTabGroup = SerializedStoredTabContainerBase & {
  type: "tabGroup";
  storedAt: string;
  name: string;
  color: string;
};
export type SerializedStoredTab = {
  type: "tab";
  internalUid: string;
  title: string;
  url: string;
  favIconUrl: string | null;
};
export type StoredWindowsObject = {
  [ChromeLocalStorage.STORED_WINDOWS_KEY]: SerializedStoredWindow[];
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

export type TabGroupSettingStorageObject = {
  [ChromeLocalStorage.TAB_GROUP_SETTING_KEY]: TabGroupSetting;
};
