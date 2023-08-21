import { Tab } from "./Tab";
import {
  Pinned,
  TabContainer,
  TabGroup,
  isPinned,
  isTabGroup,
} from "./TabContainer";

type WindowState =
  | "normal"
  | "minimized"
  | "maximized"
  | "fullscreen"
  | "locked-fullscreen";
type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";
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

export const findTab = (window: Window, tabId: number): Tab | undefined => {
  return flatTabsInWindow(window).find((tab) => tab.id === tabId);
};

export const findPinned = (window: Window): Pinned | undefined => {
  const pinned = window.children.find(
    (child) => isTabContainer(child) && isPinned(child),
  );
  return pinned as Pinned | undefined;
};

export const findTabGroup = (
  window: Window,
  groupId: number,
): TabGroup | undefined => {
  const tabGroup = window.children.find((child) => {
    return isTabContainer(child) && isTabGroup(child) && child.id === groupId;
  });
  return tabGroup as TabGroup | undefined;
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

export const isTabContainer = (
  value: TabContainer | Tab,
): value is TabContainer => {
  return "children" in value;
};
