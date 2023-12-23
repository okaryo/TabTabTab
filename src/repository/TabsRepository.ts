/* eslint @typescript-eslint/no-floating-promises: 0 */

import { Tab, TabId } from "../model/Tab";
import { WindowId } from "../model/Window";

import {
  ChromeSessionStorage,
  LastActivatedAtStorageObject,
  RecentActiveTabsStorageObject,
  SerializedTab,
} from "./ChromeStorage";

export const focusTab = async (tab: Tab) => {
  const isExistingTab = await chrome.tabs
    .get(tab.id)
    .then(() => true)
    .catch(() => false);
  if (isExistingTab) {
    chrome.windows.update(tab.windowId, { focused: true });
    chrome.tabs.update(tab.id, { active: true });
  } else {
    chrome.tabs.create({ url: tab.url.toString() });
  }
};

export const removeTab = async (tabId: number) => {
  await chrome.tabs.remove(tabId);
};

export const updateLastActivatedAtOfTab = async (tabId: number) => {
  let { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStorageObject;
  if (last_activated_at === undefined) last_activated_at = {};

  last_activated_at[tabId] = new Date().toISOString();
  await chrome.storage.session.set({
    [ChromeSessionStorage.LAST_ACTIVATED_AT_KEY]: last_activated_at,
  });
};

export const deleteLastActivatedAtOfTab = async (tabId: number) => {
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStorageObject;
  delete last_activated_at[tabId];
  await chrome.storage.session.set({
    [ChromeSessionStorage.LAST_ACTIVATED_AT_KEY]: last_activated_at,
  });
};

export const pinTab = async (tabId: number) => {
  await chrome.tabs.update(tabId, { pinned: true });
};

export const unpinTab = async (tabId: number) => {
  await chrome.tabs.update(tabId, { pinned: false });
};

export const screenshotVisibleArea = (
  windowId: number,
  callback: (dataUrl: string) => void,
) => {
  chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) =>
    callback(dataUrl),
  );
};

export const moveTab = async (tabId: number, index: number) => {
  await chrome.tabs.move(tabId, { index });
};

export const addToNewGroup = async (tabId: number) => {
  await chrome.tabs.group({ tabIds: [tabId] });
};

export const removeFromGroup = async (tabId: number) => {
  await chrome.tabs.ungroup(tabId);
};

export const moveTabOutOfGroup = async (tabId: number, index: number) => {
  await chrome.tabs.ungroup(tabId);
  await chrome.tabs.move(tabId, { index });
};

export const moveTabToOtherWindow = async (
  tabId: TabId,
  windowId: WindowId,
) => {
  await chrome.tabs.move(tabId, { windowId, index: -1 });
};

export const unpinAllTabs = async (tabs: Tab[]) => {
  for (const tab of tabs) {
    await unpinTab(tab.id);
  }
};

export const closeAllTabs = async (tabs: Tab[]) => {
  const ids = tabs.map((tab) => tab.id);
  await chrome.tabs.remove(ids);
};

export const getRecentActiveTabs = async (): Promise<Tab[]> => {
  let { recent_active_tabs: recentActiveTabs } =
    (await chrome.storage.session.get(
      ChromeSessionStorage.RECENT_ACTIVE_TABS_KEY,
    )) as RecentActiveTabsStorageObject;
  if (recentActiveTabs === undefined) recentActiveTabs = [];

  return recentActiveTabs.map((serializedTab) =>
    deserializeToTab(serializedTab),
  );
};

export const updateRecentActiveTabs = async (tabId: number) => {
  const tab = await getTabBy(tabId);
  const serializedTab = serializeTab(tab);

  let { recent_active_tabs: recentActiveTabs } =
    (await chrome.storage.session.get(
      ChromeSessionStorage.RECENT_ACTIVE_TABS_KEY,
    )) as RecentActiveTabsStorageObject;
  if (recentActiveTabs === undefined) recentActiveTabs = [];

  const uniqueTabs = recentActiveTabs.filter((recentActiveTab) => {
    const isDuplicated =
      recentActiveTab.id === tab.id ||
      (recentActiveTab.title === tab.title &&
        recentActiveTab.url === tab.url.toString());
    return !isDuplicated;
  });

  const newTabs = [serializedTab, ...uniqueTabs].slice(0, 10);
  await chrome.storage.session.set({
    [ChromeSessionStorage.RECENT_ACTIVE_TABS_KEY]: newTabs,
  });
};

const getTabBy = async (tabId: number): Promise<Tab> => {
  const tab = await chrome.tabs.get(tabId);
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStorageObject;

  return {
    id: tab.id,
    groupId:
      tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE ? null : tab.groupId,
    windowId:
      tab.windowId === chrome.windows.WINDOW_ID_NONE ? null : tab.windowId,
    title: tab.title,
    url: tab.url && tab.url !== "" ? new URL(tab.url) : new URL(tab.pendingUrl),
    favIconUrl:
      tab.favIconUrl && tab.favIconUrl !== "" ? new URL(tab.favIconUrl) : null,
    highlighted: tab.highlighted,
    audible: tab.audible,
    pinned: tab.pinned,
    lastActivatedAt: last_activated_at[tabId]
      ? new Date(last_activated_at[tabId])
      : null,
  };
};

const serializeTab = (tab: Tab) => {
  return {
    id: tab.id,
    groupId: tab.groupId,
    windowId: tab.windowId,
    title: tab.title,
    url: tab.url.toString(),
    favIconUrl: tab.favIconUrl?.toString(),
    highlighted: false,
    audible: false,
    pinned: false,
    lastActivatedAt: tab.lastActivatedAt?.toISOString(),
  };
};

const deserializeToTab = (serializedTab: SerializedTab): Tab => {
  return {
    id: serializedTab.id,
    groupId: serializedTab.groupId,
    windowId: serializedTab.windowId,
    title: serializedTab.title,
    url: new URL(serializedTab.url),
    favIconUrl: serializedTab.favIconUrl
      ? new URL(serializedTab.favIconUrl)
      : null,
    highlighted: serializedTab.highlighted,
    audible: serializedTab.audible,
    pinned: serializedTab.pinned,
    lastActivatedAt: serializedTab.lastActivatedAt
      ? new Date(serializedTab.lastActivatedAt)
      : null,
  };
};
