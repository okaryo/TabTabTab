import { GroupedColor } from "./../model/GroupedColor";
import { GroupId } from "./../model/GroupId";
import { Tab } from "./../model/Tab";
import { TabId } from "./../model/TabId";
import { Window } from "./../model/Window";
import { WindowId } from "./../model/WindowId";
import { Windows } from "./../model/Windows";
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

  const windowId = new WindowId(currentWindowTabs[0].windowId);
  let currentWindow = Window.initializeBy(windowId, true);
  for (const tab of currentWindowTabs) {
    const newTab = new Tab(
      new TabId(tab.id),
      tab.title,
      new URL(tab.url),
      tab.favIconUrl,
      tab.highlighted
    );

    if (tab.pinned) {
      currentWindow = currentWindow.addPinnedTab(newTab);
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = new GroupId(tab.groupId);
      const group = await chrome.tabGroups.get(groupId.value);
      const groupColor = new GroupedColor(group.color);
      currentWindow = currentWindow.addGroupedTab(
        groupId,
        group.title,
        groupColor,
        newTab
      );
    } else {
      currentWindow = currentWindow.addTab(newTab);
    }
  }
  return currentWindow;
};

const getUnfocusedWindows = async (): Promise<Windows> => {
  const unfocusedWindowTabs = await chrome.tabs.query({ currentWindow: false });

  let windows = Windows.empty();
  for (const tab of unfocusedWindowTabs) {
    const windowId = new WindowId(tab.windowId);
    const newTab = new Tab(
      new TabId(tab.id),
      tab.title,
      new URL(tab.url),
      tab.favIconUrl,
      tab.highlighted
    );

    if (tab.pinned) {
      windows = windows.addPinnedTab(windowId, false, newTab);
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = new GroupId(tab.groupId);
      const group = await chrome.tabGroups.get(groupId.value);
      const groupColor = new GroupedColor(group.color);
      windows = windows.addGroupedTab(
        windowId,
        false,
        newTab,
        groupId,
        group.title,
        groupColor
      );
    } else {
      windows = windows.addTab(windowId, false, newTab);
    }
  }
  return windows;
};

const applyLastActivatedAtOfTabInWindows = async (
  windows: Windows
): Promise<Windows> => {
  let newWindows = windows;
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY
  )) as LastActivatedAtStoredData;
  if (!last_activated_at || Object.keys(last_activated_at).length === 0)
    return windows;

  for (const [tabId, dateString] of Object.entries(last_activated_at)) {
    newWindows = newWindows.updateLastActivatedAtOfTabBy(
      new TabId(Number(tabId)),
      new Date(dateString)
    );
  }
  return newWindows;
};
