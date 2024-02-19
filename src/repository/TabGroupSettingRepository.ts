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

export const addListenerOnUpdateTabGroupSetting = (
  callback: (setting: TabGroupSetting) => void,
) => {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => onTabGroupSettingChanged(changes, areaName, callback);
  chrome.storage.onChanged.addListener(listener);

  return listener;
};

export const removeListenerOnUpdateTabGroupSetting = (
  listener: (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => void,
) => {
  chrome.storage.onChanged.removeListener(listener);
};

const onTabGroupSettingChanged = (
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: string,
  callback: (setting: TabGroupSetting) => void,
) => {
  if (areaName !== "local") return;
  if (ChromeLocalStorage.TAB_GROUP_SETTING_KEY in changes) {
    const newSetting = changes[ChromeLocalStorage.TAB_GROUP_SETTING_KEY]
      .newValue as TabGroupSetting;
    callback(newSetting);
  }
};
