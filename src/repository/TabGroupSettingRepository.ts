import { parse } from "tldts";

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

export const groupTabsBySetting = async (setting: TabGroupSetting) => {
  const windows = await chrome.windows.getAll({ populate: true });
  for (const window of windows) {
    await ungroupAll(window.tabs);

    const filteredTabs = window.tabs.filter((tab) => !tab.pinned);
    const groups = groupTabsBy(filteredTabs, setting.groupBy);
    for (const groupName in groups) {
      if (groups[groupName].length <= 1) continue;

      const tabs = groups[groupName];
      const existActiveTab = tabs.some((tab) => tab.active);
      const groupId = await chrome.tabs.group({
        tabIds: tabs.map((tab) => tab.id),
      });
      await chrome.tabGroups.update(groupId, { title: groupName });
      if (setting.collapseWhenNoInUse && !existActiveTab) {
        await chrome.tabGroups.update(groupId, { collapsed: true });
      }
    }
  }
};

const ungroupAll = async (tabs: chrome.tabs.Tab[]) => {
  await Promise.all(
    tabs.map(async (tab) => {
      if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
        await chrome.tabs.ungroup(tab.id);
      }
    }),
  );
};

const groupTabsBy = (
  tabs: chrome.tabs.Tab[],
  groupBy: "domain" | "subdomain",
): { [key: string]: chrome.tabs.Tab[] } => {
  const groups: { [key: string]: chrome.tabs.Tab[] } = {};
  const groupNameBy = (url: string) => {
    if (groupBy === "domain") {
      return parse(url).domainWithoutSuffix;
    } else if (groupBy === "subdomain") {
      const parsedUrl = parse(url);
      return ["", "www"].includes(parsedUrl.subdomain)
        ? parsedUrl.domainWithoutSuffix
        : `${parsedUrl.subdomain}.${parsedUrl.domainWithoutSuffix}`;
    }
  };

  for (const tab of tabs) {
    const groupName = groupNameBy(tab.url);
    if (!groupName) continue;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(tab);
  }

  return groups;
};
