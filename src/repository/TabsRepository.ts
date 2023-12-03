import { Tab, TabId } from "../model/Tab";
import { WindowId } from "../model/Window";

import {
  ChromeSessionStorage,
  LastActivatedAtStoredData,
} from "./ChromeStorage";

export const focusTab = async (tabId: number) => {
  const tab = await chrome.tabs.get(tabId);
  const windowId = tab.windowId;

  /* eslint @typescript-eslint/no-floating-promises: 0 */
  chrome.windows.update(windowId, { focused: true });
  chrome.tabs.update(tabId, { active: true });
};

export const removeTab = async (tabId: number) => {
  await chrome.tabs.remove(tabId);
};

export const updateLastActivatedAtOfTab = async (tabId: number) => {
  let { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStoredData;
  if (last_activated_at === undefined) last_activated_at = {};

  last_activated_at[tabId] = new Date().toISOString();
  await chrome.storage.session.set({
    [ChromeSessionStorage.LAST_ACTIVATED_AT_KEY]: last_activated_at,
  });
};

export const deleteLastActivatedAtOfTab = async (tabId: number) => {
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStoredData;
  delete last_activated_at[tabId];
  await chrome.storage.session.set({
    [ChromeSessionStorage.LAST_ACTIVATED_AT_KEY]: last_activated_at,
  });
};

export const bookmarkTab = async (title: string, url: string) => {
  await chrome.bookmarks.create({ title: title, url: url });
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
