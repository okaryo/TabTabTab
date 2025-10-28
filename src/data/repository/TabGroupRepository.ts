import type {
  StoredPinned,
  StoredTabGroup,
  TabGroup,
  TabGroupColor,
} from "../../model/TabContainer";
import type { WindowId } from "../../model/Window";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

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

export const createGroupWithTabs = async (name: string, tabIds: number[]) => {
  if (tabIds.length === 0) return;

  const groupId = await chrome.tabs.group({
    tabIds: tabIds as [number, ...number[]],
  });
  await chrome.tabGroups.update(groupId, { title: name });
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
  color: TabGroupColor,
) => {
  await chrome.tabGroups.update(groupId, { color });
};

export const ungroup = async (tabGroup: TabGroup) => {
  const ids = tabGroup.children.map((tab) => tab.id);
  if (ids.length === 0) return;

  await chrome.tabs.ungroup(ids as [number, ...number[]]);
};

export const closeTabGroup = async (tabGroup: TabGroup) => {
  const ids = tabGroup.children.map((tab) => tab.id);
  await chrome.tabs.remove(ids);
};

export const getStoredTabGroups = async (): Promise<StoredTabGroup[]> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  if (!storedTabGroups) return [];

  return storedTabGroups.map((group) =>
    transformSerializedStoredTabGroupToModel(group),
  );
};

export const saveTabGroup = async (tabGroup: TabGroup): Promise<void> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  await ChromeLocalStorage.updateStoredTabGroups([
    {
      type: "tabGroup",
      internalUid: crypto.randomUUID(),
      storedAt: new Date().toISOString(),
      name: tabGroup.name,
      color: tabGroup.color,
      children: tabGroup.children.map((tab) => ({
        type: "tab",
        internalUid: crypto.randomUUID(),
        title: tab.title,
        url: tab.url.toString(),
        favIconUrl: tab.favIconUrl?.toString(),
      })),
    },
    ...(storedTabGroups ?? []),
  ]);
};

export const addTabToSavedGroup = async (
  groupId: string,
  tab: { title: string; url: string; favIconUrl: string | null },
): Promise<void> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  await ChromeLocalStorage.updateStoredTabGroups(
    storedTabGroups.map((group) => {
      if (group.internalUid === groupId) {
        return {
          ...group,
          children: [
            ...group.children,
            {
              type: "tab",
              internalUid: crypto.randomUUID(),
              title: tab.title,
              url: tab.url,
              favIconUrl: tab.favIconUrl,
            },
          ],
        };
      }
      return group;
    }),
  );
};

export const updateStoredTabGroupName = async (
  id: string,
  name: string,
): Promise<void> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  await ChromeLocalStorage.updateStoredTabGroups(
    storedTabGroups.map((group) => {
      if (group.internalUid === id) {
        return {
          ...group,
          name,
        };
      }
      return group;
    }),
  );
};

export const updateStoredTabGroupColor = async (
  id: string,
  color: TabGroupColor,
): Promise<void> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  await ChromeLocalStorage.updateStoredTabGroups(
    storedTabGroups.map((group) => {
      if (group.internalUid === id) {
        return {
          ...group,
          color,
        };
      }
      return group;
    }),
  );
};

export const removeStoredTabGroup = async (id: string): Promise<void> => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  await ChromeLocalStorage.updateStoredTabGroups(
    storedTabGroups.filter((group) => group.internalUid !== id),
  );
};

export const removeTabFromStoredTabGroup = async (
  groupId: string,
  tabId: string,
) => {
  const storedTabGroups = await ChromeLocalStorage.getStoredTabGroups();
  const updatedTabGroups = storedTabGroups
    .map((group) => {
      if (group.internalUid === groupId) {
        return {
          ...group,
          children: group.children.filter((tab) => tab.internalUid !== tabId),
        };
      }
      return group;
    })
    .filter((group) => group.children.length > 0);

  await ChromeLocalStorage.updateStoredTabGroups(updatedTabGroups);
};

export const restorePinned = async (pinned: StoredPinned): Promise<void> => {
  const createTabPromises = pinned.children.map((tab) =>
    chrome.tabs.create({
      url: tab.url.toString(),
      active: false,
      pinned: true,
    }),
  );
  await Promise.all(createTabPromises);
};

export const restoreTabGroup = async (
  tabGroup: StoredTabGroup,
): Promise<void> => {
  const createTabPromises = tabGroup.children.map((tab) =>
    chrome.tabs.create({ url: tab.url.toString(), active: false }),
  );
  const tabs = await Promise.all(createTabPromises);
  const tabIds = tabs.map((tab) => tab.id);
  if (tabIds.length === 0) return;

  const groupId = await chrome.tabs.group({
    tabIds: tabIds as [number, ...number[]],
  });
  await chrome.tabGroups.update(groupId, {
    title: tabGroup.name,
    color: tabGroup.color,
  });
};

export const addListenerOnChangeStoredTabGroups = (
  callback: (groups: StoredTabGroup[]) => void,
): ChromeLocalStorage.ChangeListener => {
  return ChromeLocalStorage.addListenerOnChangeStoredTabGroups(
    (serializedGroups: ChromeLocalStorage.SerializedStoredTabGroup[]) => {
      const transformedGroups = serializedGroups.map((group) =>
        transformSerializedStoredTabGroupToModel(group),
      );
      callback(transformedGroups);
    },
  );
};

export const removeListenerOnChangeStoredTabGroups = (
  listener: ChromeLocalStorage.ChangeListener,
) => {
  ChromeLocalStorage.removeListenerOnChange(listener);
};

export const sortGroupsAlphabetically = async (windowId: number) => {
  const allGroups = await chrome.tabGroups.query({ windowId });

  const groupSizeMap = {};
  for (const group of allGroups) {
    const tabsInGroup = await chrome.tabs.query({ groupId: group.id });
    groupSizeMap[group.id] = tabsInGroup.length;
  }

  const sortedGroups = allGroups.sort((a, b) => a.title.localeCompare(b.title));
  const pinnedCount = await getPinnedTabsCount(windowId);
  let currentIndex = pinnedCount;

  try {
    for (const group of sortedGroups) {
      await chrome.tabGroups.move(group.id, { index: currentIndex });
      currentIndex += groupSizeMap[group.id];
    }
  } catch (error) {
    console.error(error);
  }
};

const getPinnedTabsCount = async (windowId: number) => {
  const pinnedTabs = await chrome.tabs.query({ windowId, pinned: true });
  return pinnedTabs.length;
};

const transformSerializedStoredTabGroupToModel = (
  group: ChromeLocalStorage.SerializedStoredTabGroup,
): StoredTabGroup => {
  return {
    ...group,
    color: group.color as TabGroupColor,
    storedAt: new Date(group.storedAt),
    children: group.children.map((tab) => {
      return {
        ...tab,
        url: new URL(tab.url),
        favIconUrl: tab.favIconUrl ? new URL(tab.favIconUrl) : null,
      };
    }),
  };
};
