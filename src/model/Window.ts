import { GroupColor } from "./GroupColor";
import { Tab } from "./Tab";
import { Tabs } from "./Tabs";

type WindowState =
  | "normal"
  | "minimized"
  | "maximized"
  | "fullscreen"
  | "locked-fullscreen";
type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

export type Window = {
  id: number;
  tabs: Tabs;
  focused: boolean;
  state?: WindowState;
  type?: WindowType;
};

export const floatTabsInWindow = (window: Window): Tab[] => {
  return window.tabs.flatTabs;
};

export const addPinnedTabToWindow = (window: Window, tab: Tab): Window => {
  const newTabs = window.tabs.addPinnedTab(tab);
  return {
    ...window,
    tabs: newTabs,
  };
};

export const addGroupedTabToWindow = (
  window: Window,
  groupId: number,
  groupName: string,
  color: GroupColor,
  collapsed: boolean,
  tab: Tab,
): Window => {
  const newTabs = window.tabs.addGroupedTabBy(
    groupId,
    groupName,
    color,
    collapsed,
    tab,
  );
  return {
    ...window,
    tabs: newTabs,
  };
};
