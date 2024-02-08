import { GroupColor } from "../model/GroupColor";
import { Tab } from "../model/Tab";
import {
  Pinned,
  StoredPinned,
  StoredTabGroup,
  TabGroup,
  generatePinnedId,
  isPinned,
  isTabGroup,
} from "../model/TabContainer";
import {
  StoredWindow,
  Window,
  WindowId,
  findPinned,
  findTabGroup,
  updateLastActivatedAtOfTab,
} from "../model/Window";

import {
  ChromeLocalStorage,
  ChromeSessionStorage,
  LastActivatedAtStorageObject,
  SerializedStoredTab,
  StoredWindowsObject,
} from "./ChromeStorage";

export const getWindows = async (): Promise<Window[]> => {
  const currentWindow = await chrome.windows.getCurrent();
  return applyLastActivatedAtOfTabInWindows(await windows(currentWindow.id));
};

export const addWindow = async (): Promise<WindowId> => {
  const window = await chrome.windows.create({ focused: false });
  return window.id;
};

export const addWindowWithTab = async (tabId: number): Promise<void> => {
  await chrome.windows.create({ tabId, focused: false });
};

export const addWindowWithTabGroup = async (
  tabGroup: TabGroup,
): Promise<void> => {
  const window = await chrome.windows.create({ focused: false });
  await chrome.tabGroups.move(tabGroup.id, { windowId: window.id, index: -1 });

  // NOTE: Remove the new tab created when the window is opened
  const emptyTab = window.tabs[0];
  await chrome.tabs.remove(emptyTab.id);
};

export const closeWindow = async (id: number): Promise<void> => {
  await chrome.windows.remove(id);
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

export const getStoredWindows = async (): Promise<StoredWindow[]> => {
  const { stored_windows: storedWindows } = (await chrome.storage.local.get(
    ChromeLocalStorage.STORED_WINDOWS_KEY,
  )) as StoredWindowsObject;
  if (!storedWindows) return [];

  const deserializeStoredTab = (tab: SerializedStoredTab) => {
    return {
      ...tab,
      url: new URL(tab.url),
      favIconUrl: tab.favIconUrl ? new URL(tab.favIconUrl) : null,
    };
  };

  return storedWindows.map((window) => {
    const children = window.children.map((child) => {
      if (child.type === "pinned") {
        return {
          ...child,
          children: child.children.map((tab) => deserializeStoredTab(tab)),
        };
      }
      if (child.type === "tabGroup") {
        return {
          ...child,
          color: new GroupColor(child.color as GroupColor["value"]),
          children: child.children.map((tab) => deserializeStoredTab(tab)),
        };
      }

      return deserializeStoredTab(child);
    });

    return {
      ...window,
      storedAt: new Date(window.storedAt),
      children,
    };
  });
};

export const saveStoredWindow = async (
  window: Window,
  name: string,
): Promise<StoredWindow[]> => {
  const { stored_windows: storedWindows } = (await chrome.storage.local.get(
    ChromeLocalStorage.STORED_WINDOWS_KEY,
  )) as StoredWindowsObject;

  const serializedTab = (tab: Tab) => ({
    type: "tab",
    internalUid: crypto.randomUUID(),
    title: tab.title,
    url: tab.url.toString(),
    favIconUrl: tab.favIconUrl?.toString(),
  });

  await chrome.storage.local.set({
    [ChromeLocalStorage.STORED_WINDOWS_KEY]: [
      {
        type: "window",
        internalUid: crypto.randomUUID(),
        storedAt: new Date().toISOString(),
        name: name,
        children: window.children.map((child) => {
          if (isPinned(child)) {
            return {
              type: "pinned",
              internalUid: crypto.randomUUID(),
              children: child.children.map((tab) => serializedTab(tab)),
            };
          }
          if (isTabGroup(child)) {
            return {
              type: "tabGroup",
              internalUid: crypto.randomUUID(),
              storedAt: new Date().toISOString(),
              name: child.name,
              color: child.color.value,
              children: child.children.map((tab) => serializedTab(tab)),
            };
          }

          return serializedTab(child as Tab);
        }),
      },
      ...(storedWindows ?? []),
    ],
  });

  return getStoredWindows();
};

export const removeStoredWindow = async (
  id: string,
): Promise<StoredWindow[]> => {
  const { stored_windows: storedWindows } = (await chrome.storage.local.get(
    ChromeLocalStorage.STORED_WINDOWS_KEY,
  )) as StoredWindowsObject;

  await chrome.storage.local.set({
    [ChromeLocalStorage.STORED_WINDOWS_KEY]: storedWindows.filter(
      (group) => group.internalUid !== id,
    ),
  });

  return getStoredWindows();
};

export const restoreWindow = async (
  storedWindow: StoredWindow,
): Promise<void> => {
  const window = await chrome.windows.create({ focused: false });

  for (const child of storedWindow.children) {
    if ("children" in child) {
      if (child.type === "pinned") {
        const pinned = child as StoredPinned;
        const createPinnedTabPromises = pinned.children.map((tab) =>
          chrome.tabs.create({
            url: tab.url.toString(),
            active: false,
            pinned: true,
          }),
        );
        await Promise.all(createPinnedTabPromises);
      }
      if (child.type === "tabGroup") {
        const tabGroup = child as StoredTabGroup;
        const createTabPromises = tabGroup.children.map((tab) =>
          chrome.tabs.create({ url: tab.url.toString(), active: false }),
        );
        const tabs = await Promise.all(createTabPromises);
        const tabIds = tabs.map((tab) => tab.id);
        const groupId = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(groupId, {
          title: tabGroup.name,
          color: tabGroup.color.value,
        });
      }
    } else {
      await chrome.tabs.create({
        windowId: window.id,
        url: child.url.toString(),
        active: false,
      });
    }
  }

  // NOTE: Remove the new tab created when the window is opened
  const emptyTab = window.tabs[0];
  await chrome.tabs.remove(emptyTab.id);
};
