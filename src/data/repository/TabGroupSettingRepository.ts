import { parse } from "tldts";
import {
  TabGroupSetting,
  defaultTabGroupSetting,
} from "../../model/TabGroupSetting";

import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const getTabGroupSetting = async (): Promise<TabGroupSetting> => {
  const setting = await ChromeLocalStorage.getTabGroupSetting();
  if (!setting) return defaultTabGroupSetting;

  return setting;
};

export const updateTabGroupSetting = async (setting: TabGroupSetting) => {
  return ChromeLocalStorage.updateTabGroupSetting(setting);
};

export const addListenerOnChangeTabGroupSetting = (
  callback: (setting: TabGroupSetting) => void,
): ChromeLocalStorage.ChangeListener => {
  return ChromeLocalStorage.addListenerOnChangeTabGroupSetting(callback);
};

export const removeListenerOnChangeTabGroupSetting = (
  listener: ChromeLocalStorage.ChangeListener,
) => {
  ChromeLocalStorage.removeListenerOnChange(listener);
};

export const groupTabsBySetting = async (setting: TabGroupSetting) => {
  const windows = await chrome.windows.getAll({
    populate: true,
    windowTypes: ["normal"],
  });
  for (const window of windows) {
    await ungroupAll(window.tabs);

    const filteredTabs = window.tabs.filter((tab) => !tab.pinned);
    const groups = groupTabsBy(filteredTabs, setting.groupBy);
    for (const groupName in groups) {
      if (groups[groupName].length <= 1) continue;

      const tabs = groups[groupName];
      const containsActiveTab = tabs.some((tab) => tab.active);
      const groupId = await chrome.tabs.group({
        tabIds: tabs.map((tab) => tab.id),
      });
      await chrome.tabGroups.update(groupId, { title: groupName });
      if (setting.collapseWhenNoInUse && !containsActiveTab) {
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
    const parsedUrl = parse(url);
    if (!parsedUrl.domainWithoutSuffix) return;

    if (groupBy === "domain") {
      return parsedUrl.domainWithoutSuffix;
    }
    if (groupBy === "subdomain") {
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
