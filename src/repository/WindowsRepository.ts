import { GroupedColor } from "../model/GroupedColor";
import { Tabs } from "../model/Tabs";
import { Window } from "../model/Window";
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
  const currentWindow = await chrome.windows.getCurrent();

  let parsedTabs = new Tabs([]);
  for (const tab of currentWindow.tabs) {
    const parsedTab = {
      id: tab.id,
      groupId: tab.groupId,
      windowId: tab.windowId,
      title: tab.title,
      url: new URL(tab.url),
      favIconUrl: new URL(tab.favIconUrl),
      highlighted: tab.highlighted,
      audible: tab.audible,
    };

    if (tab.pinned) {
      parsedTabs = parsedTabs.add(parsedTab);
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = tab.groupId;
      const group = await chrome.tabGroups.get(groupId);
      const groupColor = new GroupedColor(group.color);
      parsedTabs = parsedTabs.addGroupedTabBy(
        groupId,
        group.title,
        groupColor,
        group.collapsed,
        parsedTab,
      );
    } else {
      parsedTabs = parsedTabs.add(parsedTab);
    }
  }

  return { id: currentWindow.id, tabs: parsedTabs, focused: true };
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
      favIconUrl: new URL(tab.favIconUrl),
      highlighted: tab.highlighted,
      audible: tab.audible,
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
