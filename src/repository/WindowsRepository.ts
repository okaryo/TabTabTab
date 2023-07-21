import { GroupedColor } from "../model/GroupedColor";
import { Tabs } from "../model/Tabs";
import {
  Window,
  addGroupedTabToWindow,
  addPinnedTabToWindow,
} from "../model/Window";
import { Windows } from "../model/Windows";

import {
  ChromeSessionStorage,
  LastActivatedAtStoredData,
} from "./ChromeStorage";

export const getWindows = async (): Promise<Windows> => {
  const currentWindow = await getCurrentWindow();
  const unfocusedWindows = await getUnfocusedWindows();
  const windows = new Windows([currentWindow, ...unfocusedWindows.values]);
  return applyLastActivatedAtOfTabInWindows(windows);
};

const getCurrentWindow = async (): Promise<Window> => {
  const currentWindowTabs = await chrome.tabs.query({ currentWindow: true });

  const windowId = currentWindowTabs[0].windowId;
  let currentWindow = { id: windowId, tabs: new Tabs([]), focused: true };
  for (const tab of currentWindowTabs) {
    const newTab = {
      id: tab.id,
      groupId: tab.groupId,
      windowId,
      title: tab.title,
      url: new URL(tab.url),
      favIconUrl: tab.favIconUrl,
      isFocused: tab.highlighted,
      isAudioPlaying: tab.audible,
    };

    if (tab.pinned) {
      currentWindow = addPinnedTabToWindow(currentWindow, newTab);
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = tab.groupId;
      const group = await chrome.tabGroups.get(groupId);
      const groupColor = new GroupedColor(group.color);
      currentWindow = addGroupedTabToWindow(
        currentWindow,
        groupId,
        group.title,
        groupColor,
        group.collapsed,
        newTab,
      );
    } else {
      currentWindow = {
        ...currentWindow,
        tabs: currentWindow.tabs.add(newTab),
      };
    }
  }
  return currentWindow;
};

const getUnfocusedWindows = async (): Promise<Windows> => {
  const unfocusedWindowTabs = await chrome.tabs.query({ currentWindow: false });

  let windows = Windows.empty();
  for (const tab of unfocusedWindowTabs) {
    const windowId = tab.windowId;
    const newTab = {
      id: tab.id,
      groupId: tab.groupId,
      windowId,
      title: tab.title,
      url: new URL(tab.url),
      favIconUrl: tab.favIconUrl,
      isFocused: tab.highlighted,
      isAudioPlaying: tab.audible,
    };

    if (tab.pinned) {
      windows = windows.addPinnedTab(windowId, false, newTab);
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = tab.groupId;
      const group = await chrome.tabGroups.get(groupId);
      const groupColor = new GroupedColor(group.color);
      windows = windows.addGroupedTab(
        windowId,
        false,
        newTab,
        groupId,
        group.title,
        group.collapsed,
        groupColor,
      );
    } else {
      windows = windows.addTab(windowId, false, newTab);
    }
  }
  return windows;
};

const applyLastActivatedAtOfTabInWindows = async (
  windows: Windows,
): Promise<Windows> => {
  let newWindows = windows;
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStoredData;
  if (!last_activated_at || Object.keys(last_activated_at).length === 0)
    return windows;

  for (const [tabId, dateString] of Object.entries(last_activated_at)) {
    newWindows = newWindows.updateLastActivatedAtOfTabBy(
      Number(tabId),
      new Date(dateString),
    );
  }
  return newWindows;
};
