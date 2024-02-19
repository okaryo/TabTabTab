import {
  TabGroupSetting,
  defaultTabGroupSetting,
} from "../model/TabGroupSetting";

import {
  ChromeLocalStorage,
  TabGroupSettingStorageObject,
} from "./ChromeStorage";

export const getTabGroupSetting = async (): Promise<TabGroupSetting> => {
  const { tab_group_setting: tabGroupSetting } =
    (await chrome.storage.local.get(
      ChromeLocalStorage.TAB_GROUP_SETTING_KEY,
    )) as TabGroupSettingStorageObject;

  return tabGroupSetting ?? defaultTabGroupSetting;
};

export const updateTabGroupSetting = async (setting: TabGroupSetting) => {
  await chrome.storage.local.set({
    [ChromeLocalStorage.TAB_GROUP_SETTING_KEY]: setting,
  });
};

export const addListenerOnUpdateTabGroupSetting = (callback: () => void) => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (ChromeLocalStorage.TAB_GROUP_SETTING_KEY in changes) {
      callback();
    }
  });
};

export const removeListenerOnUpdateTabGroupSetting = (callback: () => void) => {
  chrome.storage.onChanged.removeListener(callback);
};
