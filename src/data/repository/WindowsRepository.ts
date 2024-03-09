import { Tab } from "../../model/Tab";
import {
  Pinned,
  StoredPinned,
  StoredTabGroup,
  TabGroup,
  generatePinnedId,
  isPinned,
  isTab,
  isTabContainer,
  isTabGroup,
} from "../../model/TabContainer";
import {
  StoredWindow,
  Window,
  WindowId,
  findPinned,
  findTabGroup,
  flatTabsInWindow,
} from "../../model/Window";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";
import { ChromeSessionStorage } from "../storage/ChromeSessionStorage";
import { applyLastActivatedAt, parseTab } from "./TabsRepository";

export const getWindows = async (): Promise<Window[]> => {
  const currentWindow = await chrome.windows.getCurrent();
  const windows = await chrome.windows.getAll({
    populate: true,
    windowTypes: ["normal"],
  });

  const parsedWindows: Window[] = [];
  for (const window of windows) {
    const parsedWindow: Window = {
      id: window.id,
      focused: window.id === currentWindow.id,
      state: window.state,
      type: window.type,
      children: [],
    };

    for (const tab of window.tabs) {
      const parsedTab = parseTab(tab);
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
        const tabGroup = findTabGroup(groupId, parsedWindow);
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
          const newTabGroup = {
            id: groupId,
            name: group.title,
            color: group.color,
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

  return applyLastActivatedAtToTabs(parsedWindows);
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

export const closeWindow = async (window: Window): Promise<Window[]> => {
  /*
    NOTE:
    The `chrome.windows.remove` operation can be heavy, and sometimes,
    when retrieving windows immediately after a remove operation,
    the window supposed to be deleted may still appear.
    Therefore, to ensure the window is closed reliably, we use `chrome.tabs.remove(tabIds)`.
  */
  const allTabs = flatTabsInWindow(window);
  const tabIds = allTabs.map((tab) => tab.id);
  await chrome.tabs.remove(tabIds);

  return getWindows();
};

const applyLastActivatedAtToTabs = async (
  windows: Window[],
): Promise<Window[]> => {
  const lastAccessesInSession = await ChromeSessionStorage.getTabLastAccesses();
  const lastAccessesInLocal = await ChromeLocalStorage.getTabLastAccesses();
  const newWindows = [];
  for (const window of windows) {
    const windowChildren = [];
    for (const windowChild of window.children) {
      if (isTabContainer(windowChild)) {
        const containerChildren = [];
        for (const containerChild of windowChild.children) {
          const applied = await applyLastActivatedAt(containerChild, {
            session: lastAccessesInSession,
            local: lastAccessesInLocal,
          });
          containerChildren.push(applied);
        }
        windowChildren.push({
          ...windowChild,
          children: containerChildren,
        });
      }
      if (isTab(windowChild)) {
        const applied = await applyLastActivatedAt(windowChild, {
          session: lastAccessesInSession,
          local: lastAccessesInLocal,
        });
        windowChildren.push(applied);
      }
    }
    newWindows.push({
      ...window,
      children: windowChildren,
    });
  }
  return newWindows;
};

export const getStoredWindows = async (): Promise<StoredWindow[]> => {
  const storedWindows = await ChromeLocalStorage.getStoredWindows();
  if (!storedWindows) return [];

  const deserializeStoredTab = (
    tab: ChromeLocalStorage.SerializedStoredTab,
  ) => {
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
          color: child.color,
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
): Promise<StoredWindow[]> => {
  const storedWindows = await ChromeLocalStorage.getStoredWindows();

  const serializedTab = (tab: Tab): ChromeLocalStorage.SerializedStoredTab => ({
    type: "tab",
    internalUid: crypto.randomUUID(),
    title: tab.title,
    url: tab.url.toString(),
    favIconUrl: tab.favIconUrl?.toString(),
  });

  const currentDateTime = new Date();
  await ChromeLocalStorage.updateStoredWindows([
    {
      type: "window",
      internalUid: crypto.randomUUID(),
      storedAt: currentDateTime.toISOString(),
      name: currentDateTime.toLocaleDateString(),
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
            storedAt: currentDateTime.toISOString(),
            name: child.name,
            color: child.color,
            children: child.children.map((tab) => serializedTab(tab)),
          };
        }

        return serializedTab(child as Tab);
      }),
    },
    ...(storedWindows ?? []),
  ]);

  return getStoredWindows();
};

export const updateStoredWindowName = async (
  id: string,
  name: string,
): Promise<StoredWindow[]> => {
  const storedWindows = await ChromeLocalStorage.getStoredWindows();
  await ChromeLocalStorage.updateStoredWindows(
    storedWindows.map((window) => {
      if (window.internalUid === id) {
        return { ...window, name };
      }
      return window;
    }),
  );

  return getStoredWindows();
};

export const removeStoredWindow = async (
  id: string,
): Promise<StoredWindow[]> => {
  const storedWindows = await ChromeLocalStorage.getStoredWindows();
  await ChromeLocalStorage.updateStoredWindows(
    storedWindows.filter((group) => group.internalUid !== id),
  );

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
            windowId: window.id,
          }),
        );
        await Promise.all(createPinnedTabPromises);
      }
      if (child.type === "tabGroup") {
        const tabGroup = child as StoredTabGroup;
        const createTabPromises = tabGroup.children.map((tab) =>
          chrome.tabs.create({
            url: tab.url.toString(),
            active: false,
            windowId: window.id,
          }),
        );
        const tabs = await Promise.all(createTabPromises);
        const tabIds = tabs.map((tab) => tab.id);
        const groupId = await chrome.tabs.group({
          tabIds,
          createProperties: { windowId: window.id },
        });
        await chrome.tabGroups.update(groupId, {
          title: tabGroup.name,
          color: tabGroup.color,
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
