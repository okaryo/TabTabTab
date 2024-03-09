import { PopupSize } from "../../model/PopupSize";
import { DurationUnit, TabCleaner } from "../../model/TabCleaner";
import { TabGroupSetting } from "../../model/TabGroupSetting";
import { Mode, ThemeColor } from "../../model/Theme";

export namespace ChromeLocalStorage {
  const TAB_CLEANER_SETTING_KEY = "tab_cleaner_setting";
  const POPUP_SIZE_SETTING_KEY = "popup_size_setting";
  const POPUP_ELEMENT_SCALE_SETTING_KEY = "popup_element_scale";
  const MODE_KEY = "mode";
  const THEME_COLOR_KEY = "theme_color";
  const STORED_WINDOWS_KEY = "stored_windows";
  const STORED_TAB_GROUPS_KEY = "stored_tab_groups";
  // FIXME: remove export
  export const TAB_GROUP_SETTING_KEY = "tab_group_setting";
  const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_local";

  export type ChangeListener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => Promise<void>;
  export const removeListenerOnChange = (listener: ChangeListener) => {
    chrome.storage.onChanged.removeListener(listener);
  };

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

  // Mode
  export type ModeStorageObject = {
    [MODE_KEY]: Mode;
  };
  export const getMode = async () => {
    const { [MODE_KEY]: mode } = (await chrome.storage.local.get(
      MODE_KEY,
    )) as ModeStorageObject;
    return mode;
  };
  export const updateMode = (mode: Mode) => {
    return chrome.storage.local.set({
      [MODE_KEY]: mode,
    });
  };
  export const addListenerOnChangeMode = (
    callback: (mode: Mode) => void,
  ): ChangeListener => {
    const listener = async (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && MODE_KEY in changes) {
        const newValue = changes[MODE_KEY].newValue as Mode;
        callback(newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return listener;
  };

  // ThemeColor
  export type ThemeColorStorageObject = {
    [THEME_COLOR_KEY]: ThemeColor;
  };
  export const getThemeColor = async () => {
    const { [THEME_COLOR_KEY]: color } = (await chrome.storage.local.get(
      THEME_COLOR_KEY,
    )) as ThemeColorStorageObject;
    return color;
  };
  export const updateThemeColor = (color: ThemeColor) => {
    return chrome.storage.local.set({
      [THEME_COLOR_KEY]: color,
    });
  };
  export const addListenerOnChangeThemeColor = (
    callback: (color: ThemeColor) => void,
  ): ChangeListener => {
    const listener = async (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && THEME_COLOR_KEY in changes) {
        const newValue = changes[THEME_COLOR_KEY].newValue as ThemeColor;
        callback(newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return listener;
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
  export const addListenerOnChangeTabGroupSetting = (
    callback: (setting: TabGroupSetting) => void,
  ): ChangeListener => {
    const listener = async (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string,
    ) => {
      if (areaName === "local" && TAB_GROUP_SETTING_KEY in changes) {
        const newValue = changes[TAB_CLEANER_SETTING_KEY]
          .newValue as TabGroupSetting;
        callback(newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);

    return listener;
  };

  // TabLastAccesses
  type TabLastAccessesStorageObject = {
    [TAB_LAST_ACCESSES_KEY]: {
      [tabHashKey: string]: {
        lastActivatedAt: string;
      };
    };
  };
  export const getTabLastAccesses = async () => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccesses = {} } =
      (await chrome.storage.local.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;

    return lastAccesses;
  };
  export const updateTabLastAccesses = async (
    key: string,
    lastActivatedAt: Date,
  ) => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccesses = {} } =
      (await chrome.storage.local.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;
    await chrome.storage.local.set({
      [TAB_LAST_ACCESSES_KEY]: {
        ...lastAccesses,
        [key]: {
          lastActivatedAt: lastActivatedAt.toISOString(),
        },
      },
    });
  };
  export const cleanupTabLastAccesses = async (keepKeys: string[]) => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccesses = {} } =
      (await chrome.storage.local.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;

    const keepLastAccesses = {};
    for (const key of keepKeys) {
      keepLastAccesses[key] = lastAccesses[key];
    }

    await chrome.storage.local.set({
      [TAB_LAST_ACCESSES_KEY]: keepLastAccesses,
    });
  };
}
