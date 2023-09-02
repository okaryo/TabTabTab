import { Tab, TabId } from "./Tab";
import {
  Pinned,
  TabContainer,
  TabContainerId,
  TabGroup,
  isPinned,
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
type WindowChildId = TabContainerId | TabId;
export type WindowChild = TabContainer | Tab;
export type Window = {
  id: number;
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
  const isDupulicated = (a: Tab, b: Tab): boolean => {
    return a.id !== b.id && a.title === b.title && a.url.href === b.url.href;
  };

  return windows.some((window) => {
    return window.children.some((child) => {
      if (isTabContainer(child)) {
        return child.children.some((tab) => isDupulicated(tab, targetTab));
      }
      return isDupulicated(child, targetTab);
    });
  });
};
