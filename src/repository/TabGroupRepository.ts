import { GroupColor } from "../model/GroupColor";
import { StoredTabGroup, TabGroup } from "../model/TabContainer";
import { WindowId } from "../model/Window";

import { ChromeLocalStorage, StoredTabGroupsObject } from "./ChromeStorage";

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

export const getStoredTabGroups = async (): Promise<StoredTabGroup[]> => {
  const { stored_tab_groups: storedTabGroups } =
    (await chrome.storage.local.get(
      ChromeLocalStorage.STORED_TAB_GROUPS_KEY,
    )) as StoredTabGroupsObject;
  if (!storedTabGroups) return [];

  return storedTabGroups.map((group) => {
    return {
      ...group,
      color: new GroupColor(group.color as GroupColor["value"]),
      storedAt: new Date(group.storedAt),
      children: group.children.map((tab) => {
        return {
          ...tab,
          url: new URL(tab.url),
          favIconUrl: tab.favIconUrl ? new URL(tab.favIconUrl) : null,
        };
      }),
    };
  });
};

export const saveStoredTabGroup = async (
  tabGroup: TabGroup,
): Promise<StoredTabGroup[]> => {
  const { stored_tab_groups: storedTabGroups } =
    (await chrome.storage.local.get(
      ChromeLocalStorage.STORED_TAB_GROUPS_KEY,
    )) as StoredTabGroupsObject;

  await chrome.storage.local.set({
    [ChromeLocalStorage.STORED_TAB_GROUPS_KEY]: [
      {
        type: "tabGroup",
        internalUid: crypto.randomUUID(),
        storedAt: new Date().toISOString(),
        name: tabGroup.name,
        color: tabGroup.color.value,
        children: tabGroup.children.map((tab) => ({
          type: "tab",
          internalUid: crypto.randomUUID(),
          title: tab.title,
          url: tab.url.toString(),
          favIconUrl: tab.favIconUrl?.toString(),
        })),
      },
      ...(storedTabGroups ?? []),
    ],
  });

  return getStoredTabGroups();
};

export const removeStoredTabGroup = async (
  id: string,
): Promise<StoredTabGroup[]> => {
  const { stored_tab_groups: storedTabGroups } =
    (await chrome.storage.local.get(
      ChromeLocalStorage.STORED_TAB_GROUPS_KEY,
    )) as StoredTabGroupsObject;

  await chrome.storage.local.set({
    [ChromeLocalStorage.STORED_TAB_GROUPS_KEY]: storedTabGroups.filter(
      (group) => group.internalUid !== id,
    ),
  });

  return getStoredTabGroups();
};

export const restoreTabGroup = async (
  tabGroup: StoredTabGroup,
): Promise<void> => {
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
};
