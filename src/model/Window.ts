import { Tab, TabId, isSamePageTabs } from "./Tab";
import {
  Pinned,
  TabContainer,
  TabContainerId,
  TabGroup,
  isPinned,
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

export const flatTabsInWindows = (windows: Window[]): Tab[] => {
  return windows.map((window) => flatTabsInWindow(window)).flat();
};

export const flatTabsInWindow = (window: Window): Tab[] => {
  return window.children
    .map((child) => {
      if (isTabContainer(child)) {
        return child.children;
      }
      return child;
    })
    .flat();
};

export const findParentContainer = (
  window: Window,
  id: WindowChildId,
): Window | TabContainer | undefined => {
  const isUnderWindow = window.children.find((child) => child.id === id);
  if (isUnderWindow) return window;

  const containers = window.children.filter((child) =>
    isTabContainer(child),
  ) as TabContainer[];
  return containers.find((container) =>
    container.children.some((child) => child.id === id),
  );
};

export const findWindow = (
  windows: Window[],
  windowId: number,
): Window | undefined => {
  return windows.find((window) => window.id === windowId);
};

export const findWindowChild = (
  window: Window,
  id: WindowChildId,
): WindowChild | undefined => {
  const child = window.children.find((child) => {
    if (isTabContainer(child)) {
      return child.id === id;
    }
    return child.id === id;
  });
  if (child) return child;

  return flatTabsInWindow(window).find((tab) => tab.id === id);
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
      } else {
        if (child.id === tabId) {
          return {
            ...child,
            lastActivatedAt,
          };
        }
        return child;
      }
    });
    return window;
  });
};

export const findTabsByTitleOrUrl = (
  windows: Window[],
  value: string,
): Tab[] => {
  value = value.toLowerCase();
  return flatTabsInWindows(windows).filter((tab) => {
    return (
      tab.title.toLowerCase().includes(value) ||
      tab.url.href.toLowerCase().includes(value)
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
  window: Window,
  id: TabId,
  destContainerId: WindowId | TabContainerId,
  destIndex: number,
): Window => {
  const target = findWindowChild(window, id);
  if (!target) return window;

  if (isTab(target)) {
    return moveTab(window, target, destContainerId, destIndex);
  }

  if (isTabGroup(target)) {
    return moveTabGroup(window, target, destIndex);
  }

  return window;
};

const moveTab = (
  window: Window,
  tab: Tab,
  destContainerId: WindowId | TabContainerId,
  destIndex: number,
): Window => {
  const newWindow = copyWindow(window);

  let sourceContainer: TabContainer | Window = newWindow;
  for (const child of newWindow.children) {
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
  if (sourceIndex === -1) return window;
  sourceContainer.children.splice(sourceIndex, 1);

  const destContainer =
    destContainerId === window.id
      ? newWindow
      : (newWindow.children.find(
          (child) => isTabContainer(child) && child.id === destContainerId,
        ) as TabContainer);

  if (destContainerId === "pinned") {
    tab.pinned = true;
  } else if (tab.pinned) {
    tab.pinned = false;
  }

  destContainer.children.splice(destIndex, 0, tab);

  return newWindow;
};

const moveTabGroup = (
  window: Window,
  tabGroup: TabGroup,
  destIndex: number,
): Window => {
  const children = [...window.children];
  const currentIndex = children.findIndex((child) => child.id === tabGroup.id);
  if (currentIndex === -1) return window;

  children.splice(currentIndex, 1);
  children.splice(destIndex, 0, tabGroup);

  return {
    ...window,
    children,
  };
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
