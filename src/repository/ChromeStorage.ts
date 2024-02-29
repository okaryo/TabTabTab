import { PopupSize } from "../model/PopupSize";
import { DurationUnit, TabCleaner } from "../model/TabCleaner";
import { TabGroupSetting } from "../model/TabGroupSetting";
import { generateHash } from "../utility/hash";

export namespace ChromeLocalStorage {
  const TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  const POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  const POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  const THEME_KEY = "theme";
  const STORED_WINDOWS_KEY = "stored_windows";
  const STORED_TAB_GROUPS_KEY = "stored_tab_groups";
  export const TAB_GROUP_SETTING_KEY = "tab_group_setting";
  export const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_local";

  // TabCleanerSetting
  type TabCleanerSettingStorageObject = {
    [TAB_CLEANER_SETTING_KEY]: {
      isEnabled: boolean;
      duration: number;
      durationUnit: DurationUnit;
    };
  };
  export const getTabCleanerSetting = async () => {
    const { [TAB_CLEANER_SETTING_KEY]: setting } =
      (await chrome.storage.local.get(
        TAB_CLEANER_SETTING_KEY,
      )) as TabCleanerSettingStorageObject;
    return setting;
  };
  export const updateTabCleanerSetting = async (setting: TabCleaner) => {
    return chrome.storage.local.set({
      [TAB_CLEANER_SETTING_KEY]: {
        isEnabled: setting.enabled,
        duration: setting.duration,
        durationUnit: setting.durationUnit,
      },
    });
  };

  // PopupSizeSetting
  type PopupSizeSettingStorageObject = {
    [POPUP_SIZE_SETTING_KEY]: {
      height: number;
      width: number;
    };
  };
  export const getPopupSizeSetting = async () => {
    const { [POPUP_SIZE_SETTING_KEY]: setting } =
      (await chrome.storage.local.get(
        POPUP_SIZE_SETTING_KEY,
      )) as PopupSizeSettingStorageObject;
    return setting;
  };
  export const updatePopupSizeSetting = async (setting: PopupSize) => {
    return chrome.storage.local.set({
      [POPUP_SIZE_SETTING_KEY]: {
        height: setting.height,
        width: setting.width,
      },
    });
  };

  // PopupElementScaleSetting
  type PopupElementScaleSettingStorageObject = {
    [POPUP_ELEMENT_SCALE_SETTING_KEY]: number;
  };
  export const getPopupElementScaleSetting = async () => {
    const { [POPUP_ELEMENT_SCALE_SETTING_KEY]: setting } =
      (await chrome.storage.local.get(
        POPUP_ELEMENT_SCALE_SETTING_KEY,
      )) as PopupElementScaleSettingStorageObject;
    return setting;
  };
  export const updatePopupElementScaleSetting = (scale: number) => {
    return chrome.storage.local.set({
      [POPUP_ELEMENT_SCALE_SETTING_KEY]: scale,
    });
  };

  // Theme
  type Theme = "light" | "dark";
  export type ThemeStorageObject = {
    [THEME_KEY]: Theme;
  };
  export const getTheme = async () => {
    const { [THEME_KEY]: theme } = (await chrome.storage.local.get(
      THEME_KEY,
    )) as ThemeStorageObject;
    return theme;
  };
  export const updateTheme = (theme: Theme) => {
    return chrome.storage.local.set({
      [THEME_KEY]: theme,
    });
  };

  // StoredWindows and StoredTabGroups
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
  type StoredWindowsObject = {
    [STORED_WINDOWS_KEY]: SerializedStoredWindow[];
  };
  type StoredTabGroupsObject = {
    [STORED_TAB_GROUPS_KEY]: SerializedStoredTabGroup[];
  };
  export const getStoredWindows = async () => {
    const { [STORED_WINDOWS_KEY]: storedWindows } =
      (await chrome.storage.local.get(
        STORED_WINDOWS_KEY,
      )) as StoredWindowsObject;
    return storedWindows;
  };
  export const updateStoredWindows = async (
    windows: SerializedStoredWindow[],
  ) => {
    return await chrome.storage.local.set({
      [STORED_WINDOWS_KEY]: windows,
    });
  };
  export const getStoredTabGroups = async () => {
    const { [STORED_TAB_GROUPS_KEY]: storedTabGroups } =
      (await chrome.storage.local.get(
        STORED_TAB_GROUPS_KEY,
      )) as StoredTabGroupsObject;
    return storedTabGroups;
  };
  export const updateStoredTabGroups = async (
    groups: SerializedStoredTabGroup[],
  ) => {
    return await chrome.storage.local.set({
      [STORED_TAB_GROUPS_KEY]: groups,
    });
  };

  // TabGroupSetting
  type TabGroupSettingStorageObject = {
    [TAB_GROUP_SETTING_KEY]: TabGroupSetting;
  };
  export const getTabGroupSetting = async () => {
    const { [TAB_GROUP_SETTING_KEY]: setting } =
      (await chrome.storage.local.get(
        TAB_GROUP_SETTING_KEY,
      )) as TabGroupSettingStorageObject;
    return setting;
  };
  export const updateTabGroupSetting = async (setting: TabGroupSetting) => {
    return await chrome.storage.local.set({ [TAB_GROUP_SETTING_KEY]: setting });
  };
}

export namespace ChromeSessionStorage {
  const RECENT_ACTIVE_TABS_KEY = "recent_active_tabs";
  export const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_session";

  // RecentActiveTabs
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
    discarded: boolean;
    lastActivatedAt: string | null;
  };
  type RecentActiveTabsStorageObject = {
    [RECENT_ACTIVE_TABS_KEY]: SerializedTab[];
  };
  export const getRecentActiveTabs = async () => {
    const { [RECENT_ACTIVE_TABS_KEY]: recentActiveTabs } =
      (await chrome.storage.session.get(
        RECENT_ACTIVE_TABS_KEY,
      )) as RecentActiveTabsStorageObject;
    return recentActiveTabs;
  };
  export const updateRecentActiveTabs = async (tabs: SerializedTab[]) => {
    return chrome.storage.session.set({
      [RECENT_ACTIVE_TABS_KEY]: tabs,
    });
  };
}

export namespace ChromeStorage {
  // TabLastAccesses
  type TabLastAccessesLocalStorageObject = {
    [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: {
      [tabId: string]: {
        lastActivatedAt: string;
      };
    };
  };
  type TabLastAccessesSessionStorageObject = {
    [ChromeSessionStorage.TAB_LAST_ACCESSES_KEY]: {
      [tabHashKey: string]: {
        lastActivatedAt: string;
      };
    };
  };
  export const tabKeyForLastAccessesInLocal = (title: string, url: string) =>
    generateHash(`${title}${url}`);
  export const getTabLastAccesses = async () => {
    const {
      [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInLocal = {},
    } = (await chrome.storage.local.get(
      ChromeLocalStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesLocalStorageObject;
    const {
      [ChromeSessionStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInSession = {},
    } = (await chrome.storage.session.get(
      ChromeSessionStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesSessionStorageObject;

    return {
      local: lastAccessesInLocal,
      session: lastAccessesInSession,
    };
  };
  export const updateTabLastAccesses = async (tab: chrome.tabs.Tab) => {
    const lastActivatedAt = new Date().toISOString();

    const key = await tabKeyForLastAccessesInLocal(
      tab.title,
      tab.url !== "" ? tab.url : tab.pendingUrl,
    );
    const {
      [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInLocal = {},
    } = (await chrome.storage.local.get(
      ChromeLocalStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesLocalStorageObject;
    await chrome.storage.local.set({
      [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: {
        ...lastAccessesInLocal,
        [key]: {
          lastActivatedAt,
        },
      },
    });

    const {
      [ChromeSessionStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInSession = {},
    } = (await chrome.storage.session.get(
      ChromeSessionStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesSessionStorageObject;
    await chrome.storage.session.set({
      [ChromeSessionStorage.TAB_LAST_ACCESSES_KEY]: {
        ...lastAccessesInSession,
        [tab.id]: {
          lastActivatedAt: new Date().toISOString(),
        },
      },
    });
  };
  export const cleanupTabLastAccesses = async (tabId: number) => {
    const {
      [ChromeSessionStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInSession = {},
    } = (await chrome.storage.session.get(
      ChromeSessionStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesSessionStorageObject;
    delete lastAccessesInSession[tabId];

    const {
      [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: lastAccessesInLocal = {},
    } = (await chrome.storage.local.get(
      ChromeLocalStorage.TAB_LAST_ACCESSES_KEY,
    )) as TabLastAccessesLocalStorageObject;

    const windows = await chrome.windows.getAll({
      populate: true,
      windowTypes: ["normal"],
    });
    const cleanedUpInLocal = {};
    for (const tab of windows.flatMap((window) => window.tabs)) {
      const key = await tabKeyForLastAccessesInLocal(
        tab.title,
        tab.url !== "" ? tab.url : tab.pendingUrl,
      );
      cleanedUpInLocal[key] = lastAccessesInLocal[key];
    }

    await chrome.storage.local.set({
      [ChromeLocalStorage.TAB_LAST_ACCESSES_KEY]: cleanedUpInLocal,
    });
  };
}
