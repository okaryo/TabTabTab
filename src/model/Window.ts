import { StoredTab, Tab, TabId, isSamePageTabs } from "./Tab";
import {
  Pinned,
  StoredTabContainer,
  TabContainer,
  TabContainerId,
  TabGroup,
  isPinned,
  isPinnedId,
  isTab,
  isTabContainer,
  isTabGroup,
} from "./TabContainer";

type WindowState =
  | "normal"
  | "minimized"
  | "maximized"
  | "fullscreen"
  | "locked-fullscreen";
type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";
export type WindowId = number;
type WindowChildId = TabContainerId | TabId;
export type WindowChild = TabContainer | Tab;
export type Window = {
  id: WindowId;
  focused: boolean;
  state?: WindowState;
  type?: WindowType;
  children: WindowChild[];
};
export type StoredWindow = {
  type: "window";
  internalUid: string;
  name: string;
  storedAt: Date;
  children: (StoredTabContainer | StoredTab)[];
};

export const flatTabsInWindows = (windows: Window[]): Tab[] => {
  return windows.flatMap((window) => flatTabsInWindow(window));
};

export const flatTabsInWindow = (window: Window): Tab[] => {
  return window.children.flatMap((child) =>
    isTabContainer(child) ? child.children : child,
  );
};

export const findParentContainer = (
  container: Window | Window[],
  id: WindowChildId,
): Window | TabContainer | undefined => {
  const findParent = (windows: Window[]) => {
    for (const window of windows) {
      const isUnderWindow = window.children.find((child) => child.id === id);
      if (isUnderWindow) return window;

      const containers = window.children.filter((child) =>
        isTabContainer(child),
      ) as TabContainer[];
      const foundContainer = containers.find((container) =>
        container.children.some((child) => child.id === id),
      );
      if (foundContainer) return foundContainer;
    }
    return undefined;
  };

  return findParent(Array.isArray(container) ? container : [container]);
};

export const findWindow = (
  windows: Window[],
  windowId: number,
): Window | undefined => {
  return windows.find((window) => window.id === windowId);
};

export const findWindowChild = (
  container: Window | Window[],
  id: WindowChildId,
): WindowChild | undefined => {
  const findChild = (windows: Window[]) => {
    for (const window of windows) {
      const child = window.children.find((child) => child.id === id);
      if (child) return child;

      const foundTab = flatTabsInWindow(window).find((tab) => tab.id === id);
      if (foundTab) return foundTab;
    }

    return undefined;
  };

  return findChild(Array.isArray(container) ? container : [container]);
};

export const findTab = (window: Window, tabId: number): Tab | undefined => {
  return flatTabsInWindow(window).find((tab) => tab.id === tabId);
};

export const findPinned = (window: Window): Pinned | undefined => {
  const pinned = window.children.find((child) => isPinned(child));
  return pinned as Pinned | undefined;
};

export const findTabGroup = (
  window: Window,
  groupId: number,
): TabGroup | undefined => {
  const tabGroup = window.children.find((child) => {
    return isTabGroup(child) && child.id === groupId;
  });
  return tabGroup as TabGroup | undefined;
};

export const indexOfWindowChild = (
  window: Window,
  id: WindowChildId,
): number => {
  const index = flatTabsInWindow(window).findIndex((tab) => tab.id === id);
  if (index >= 0) return index;

  const containerIndex = window.children.findIndex((child) => child.id === id);
  if (containerIndex === -1 || containerIndex === 0) return containerIndex;

  return window.children.slice(0, containerIndex).reduce((sum, child) => {
    return isTabContainer(child) ? sum + child.children.length : sum + 1;
  }, 0);
};

export const updateLastActivatedAtOfTab = (
  windows: Window[],
  tabId: number,
  lastActivatedAt: Date,
): Window[] => {
  return windows.map((window) => {
    window.children = window.children.map((child) => {
      if (isTabContainer(child)) {
        return {
          ...child,
          children: child.children.map((tab) => {
            if (tab.id === tabId) {
              return {
                ...tab,
                lastActivatedAt,
              };
            }
            return tab;
          }),
        };
      }
      if (child.id === tabId) {
        return {
          ...child,
          lastActivatedAt,
        };
      }
      return child;
    });
    return window;
  });
};

export const findTabsByTitleOrUrl = (
  windows: Window[],
  value: string,
): Tab[] => {
  const lowerCasedValue = value.toLowerCase();
  return flatTabsInWindows(windows).filter((tab) => {
    return (
      tab.title.toLowerCase().includes(lowerCasedValue) ||
      tab.url.href.toLowerCase().includes(lowerCasedValue)
    );
  });
};

export const hasDuplicatedTabs = (
  windows: Window[],
  targetTab: Tab,
): boolean => {
  const isDuplicated = (a: Tab, b: Tab) =>
    a.id !== b.id && isSamePageTabs(a, b);

  return windows.some((window) => {
    return window.children.some((child) => {
      if (isTabContainer(child)) {
        return child.children.some((tab) => isDuplicated(tab, targetTab));
      }
      return isDuplicated(child, targetTab);
    });
  });
};

export const moveTabOrTabGroup = (
  windows: Window[],
  sourceId: TabId,
  sourceWindowId: WindowId,
  destWindowId: WindowId,
  destContainerId: WindowId | TabContainerId,
  destIndex: number,
): Window[] => {
  const target = findWindowChild(windows, sourceId);
  if (!target) return windows;

  if (isTab(target)) {
    return moveTab(
      windows,
      target,
      sourceWindowId,
      destWindowId,
      destContainerId,
      destIndex,
    );
  }

  if (isTabGroup(target)) {
    // NOTE: Prevent moving tabGroup before the first position if it's a pinned item.
    if (destIndex === 0) {
      const destWindow = findWindow(windows, destWindowId);
      if (destWindow.children.length > 0 && isPinned(destWindow.children[0])) {
        return windows;
      }
    }

    return moveTabGroup(
      windows,
      target,
      sourceWindowId,
      destWindowId,
      destIndex,
    );
  }

  return windows;
};

const moveTab = (
  windows: Window[],
  tab: Tab,
  sourceWindowId: WindowId,
  destWindowId: WindowId,
  destContainerId: WindowId | TabContainerId,
  destIndexInParentContainer: number,
): Window[] => {
  const newWindows = windows.map((window) => copyWindow(window));
  const sourceWindow = findWindow(newWindows, sourceWindowId);

  let sourceContainer: TabContainer | Window = sourceWindow;
  for (const child of sourceWindow.children) {
    if (
      isTabContainer(child) &&
      child.children.some((childTab) => childTab.id === tab.id)
    ) {
      sourceContainer = child;
      break;
    }
  }

  const sourceIndex = sourceContainer.children.findIndex(
    (child) => child.id === tab.id,
  );
  if (sourceIndex === -1) return windows;
  sourceContainer.children.splice(sourceIndex, 1);

  const destWindow = findWindow(newWindows, destWindowId);
  const destContainer =
    destContainerId === destWindowId
      ? destWindow
      : (destWindow.children.find(
          (child) => isTabContainer(child) && child.id === destContainerId,
        ) as TabContainer);

  if (isPinnedId(destContainerId)) {
    tab.pinned = true;
  } else if (tab.pinned) {
    tab.pinned = false;
  }

  destContainer.children.splice(destIndexInParentContainer, 0, tab);

  return newWindows;
};

const moveTabGroup = (
  windows: Window[],
  tabGroup: TabGroup,
  sourceWindowId: WindowId,
  destWindowId: WindowId,
  destIndex: number,
): Window[] => {
  const newWindows = windows.map((window) => copyWindow(window));
  const sourceWindow = findWindow(newWindows, sourceWindowId);

  const sourceChildren = [...sourceWindow.children];
  const currentIndex = sourceChildren.findIndex(
    (child) => child.id === tabGroup.id,
  );
  if (currentIndex === -1) return windows;

  sourceWindow.children.splice(currentIndex, 1);

  const destWindow = findWindow(newWindows, destWindowId);
  destWindow.children.splice(destIndex, 0, tabGroup);

  return newWindows;
};

const copyWindow = (window: Window): Window => {
  const children = window.children.map((child) => {
    if (isTabContainer(child)) {
      return {
        ...child,
        children: [...child.children],
      };
    }
    return child;
  });

  return {
    ...window,
    children,
  };
};
