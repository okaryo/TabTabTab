import { GroupColor } from "../model/GroupColor";
import {
  Pinned,
  generatePinnedId,
  isPinned,
  isTabGroup,
} from "../model/TabContainer";
import {
  Window,
  findPinned,
  findTabGroup,
  updateLastActivatedAtOfTab,
} from "../model/Window";

import {
  ChromeSessionStorage,
  LastActivatedAtStorageObject,
} from "./ChromeStorage";

export const getWindows = async (): Promise<Window[]> => {
  const currentWindow = await chrome.windows.getCurrent();
  return applyLastActivatedAtOfTabInWindows(await windows(currentWindow.id));
};

const windows = async (currentWindowId: number): Promise<Window[]> => {
  const windows = await chrome.windows.getAll({ populate: true });

  const parsedWindows: Window[] = [];
  for (const window of windows) {
    const parsedWindow: Window = {
      id: window.id,
      focused: window.id === currentWindowId,
      state: window.state,
      type: window.type,
      children: [],
    };

    for (const tab of window.tabs) {
      const parsedTab = {
        id: tab.id,
        groupId:
          tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE
            ? null
            : tab.groupId,
        windowId:
          tab.windowId === chrome.windows.WINDOW_ID_NONE ? null : tab.windowId,
        title: tab.title,
        url:
          tab.url && tab.url !== ""
            ? new URL(tab.url)
            : new URL(tab.pendingUrl),
        favIconUrl:
          tab.favIconUrl && tab.favIconUrl !== ""
            ? new URL(tab.favIconUrl)
            : null,
        highlighted: tab.highlighted,
        audible: tab.audible,
        pinned: tab.pinned,
      };

      if (tab.pinned) {
        const pinned = findPinned(parsedWindow);
        if (pinned) {
          parsedWindow.children = parsedWindow.children.map((child) => {
            if (isPinned(child)) {
              return {
                ...child,
                children: [...child.children, parsedTab],
              };
            }
            return child;
          });
        } else {
          const newPinned: Pinned = {
            id: generatePinnedId(window.id),
            children: [parsedTab],
          };
          parsedWindow.children.push(newPinned);
        }
      } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
        const groupId = tab.groupId;
        const tabGroup = findTabGroup(parsedWindow, groupId);
        if (tabGroup) {
          parsedWindow.children = parsedWindow.children.map((child) => {
            if (isTabGroup(child) && child.id === groupId) {
              return {
                ...child,
                children: [...child.children, parsedTab],
              };
            }
            return child;
          });
        } else {
          const group = await chrome.tabGroups.get(groupId);
          const groupColor = new GroupColor(group.color);
          const newTabGroup = {
            id: groupId,
            name: group.title,
            color: groupColor,
            collapsed: group.collapsed,
            children: [parsedTab],
          };
          parsedWindow.children.push(newTabGroup);
        }
      } else {
        parsedWindow.children.push(parsedTab);
      }
    }

    parsedWindows.push(parsedWindow);
  }

  return parsedWindows;
};

const applyLastActivatedAtOfTabInWindows = async (
  windows: Window[],
): Promise<Window[]> => {
  let newWindows = [...windows];
  const { last_activated_at } = (await chrome.storage.session.get(
    ChromeSessionStorage.LAST_ACTIVATED_AT_KEY,
  )) as LastActivatedAtStorageObject;
  if (!last_activated_at || Object.keys(last_activated_at).length === 0) {
    return newWindows;
  }

  for (const [tabId, dateString] of Object.entries(last_activated_at)) {
    newWindows = updateLastActivatedAtOfTab(
      newWindows,
      Number(tabId),
      new Date(dateString),
    );
  }
  return newWindows;
};
