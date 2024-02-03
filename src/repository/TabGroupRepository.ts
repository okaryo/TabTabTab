import { GroupColor } from "../model/GroupColor";
import { TabGroup } from "../model/TabContainer";
import { WindowId } from "../model/Window";

export const collapseTabGroup = async (groupId: number): Promise<void> => {
  await chrome.tabGroups.update(groupId, { collapsed: true });
};

export const expandTabGroup = async (groupId: number): Promise<void> => {
  await chrome.tabGroups.update(groupId, { collapsed: false });
};

export const addTabToTabGroup = async (
  tabId: number,
  groupId: number,
): Promise<void> => {
  await chrome.tabs.group({ tabIds: tabId, groupId });
};

export const moveTabGroup = async (
  groupId: number,
  currentWindowId: number,
  destWindowId: number,
  index: number,
): Promise<void> => {
  // NOTE: If moving within the same Window, passing the windowId will result in an error.
  await chrome.tabGroups.move(groupId, {
    index,
    windowId: currentWindowId === destWindowId ? null : destWindowId,
  });
};

export const moveTabGroupToOtherWindow = async (
  groupId: number,
  windowId: WindowId,
) => {
  await chrome.tabGroups.move(groupId, { windowId, index: -1 });
};

export const updateTabGroupTitle = async (groupId: number, title: string) => {
  await chrome.tabGroups.update(groupId, { title });
};

export const updateTabGroupColor = async (
  groupId: number,
  color: GroupColor,
) => {
  await chrome.tabGroups.update(groupId, { color: color.value });
};

export const ungroup = async (tabGroup: TabGroup) => {
  const ids = tabGroup.children.map((tab) => tab.id);
  await chrome.tabs.ungroup(ids);
};

export const closeTabGroup = async (tabGroup: TabGroup) => {
  const ids = tabGroup.children.map((tab) => tab.id);
  await chrome.tabs.remove(ids);
};
