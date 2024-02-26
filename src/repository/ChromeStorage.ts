import { DurationUnit } from "../model/TabCleaner";
import { TabGroupSetting } from "../model/TabGroupSetting";
import { generateHash } from "../utility/hash";

export namespace ChromeLocalStorage {
  export const TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  export const POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  export const POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  export const THEME_KEY = "theme";
  export const STORED_WINDOWS_KEY = "stored_windows";
  export const STORED_TAB_GROUPS_KEY = "stored_tab_groups";
  export const TAB_GROUP_SETTING_KEY = "tab_group_setting";
  export const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_local";
}

export namespace ChromeSessionStorage {
  export const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_session";
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
export const tabKeyForLastAccessesInLocal = async (
  title: string,
  url: string,
) => {
  return generateHash(`${title}${url}`);
};
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

  const windows = await chrome.windows.getAll({ populate: true });
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
  lastActivatedAt: string | null;
};
export type RecentActiveTabsStorageObject = {
  [ChromeSessionStorage.RECENT_ACTIVE_TABS_KEY]: SerializedTab[];
};

export type TabGroupSettingStorageObject = {
  [ChromeLocalStorage.TAB_GROUP_SETTING_KEY]: TabGroupSetting;
};
