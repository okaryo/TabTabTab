import { Tab, TabId } from "../model/Tab";
import { WindowId } from "../model/Window";
import { ChromeSessionStorage, ChromeStorage } from "./ChromeStorage";

export const focusTab = async (tab: Tab) => {
  const isExistingTab = await chrome.tabs
    .get(tab.id)
    .then(() => true)
    .catch(() => false);
  if (isExistingTab) {
    chrome.windows.update(tab.windowId, { focused: true });
    chrome.tabs.update(tab.id, { active: true });
  } else {
    chrome.tabs.create({ url: tab.url.toString() });
  }
};

export const closeTab = async (tabId: number) => {
  await chrome.tabs.remove(tabId);
};

export const closeTabs = async (tabIds: number[]) => {
  await chrome.tabs.remove(tabIds);
};

export const updateTabLastActivatedAt = async (
  tabId: number,
  options?: {
    onlyActiveTab?: boolean;
  },
) => {
  const tab = (await chrome.tabs
    .get(tabId)
    .catch(() => null)) as chrome.tabs.Tab | null;
  if (!tab || tab.status !== "complete") return;
  if (options?.onlyActiveTab && !tab.active) return;

  await ChromeStorage.updateTabLastAccesses(tab);
};

export const cleanupTabLastActivatedAt = async (tabId: number) => {
  await ChromeStorage.cleanupTabLastAccesses(tabId);
};

export const pinTab = async (tabId: number) => {
  await chrome.tabs.update(tabId, { pinned: true });
};

export const unpinTab = async (tabId: number) => {
  await chrome.tabs.update(tabId, { pinned: false });
};

export const screenshotVisibleArea = (
  windowId: number,
  callback: (dataUrl: string) => void,
) => {
  chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) =>
    callback(dataUrl),
  );
};

export const moveTab = async (
  tabId: number,
  windowId: number,
  index: number,
) => {
  await chrome.tabs.move(tabId, { windowId, index });
};

export const addTabToNewGroup = async (tabId: number, windowId: number) => {
  await chrome.tabs.group({ tabIds: [tabId], createProperties: { windowId } });
};

export const removeFromGroup = async (tabId: number) => {
  await chrome.tabs.ungroup(tabId);
};

export const moveTabOutOfGroup = async (
  tabId: number,
  windowId: number,
  index: number,
) => {
  await chrome.tabs.ungroup(tabId);
  await chrome.tabs.move(tabId, { windowId, index });
};

export const moveTabToOtherWindow = async (
  tabId: TabId,
  windowId: WindowId,
) => {
  await chrome.tabs.move(tabId, { windowId, index: -1 });
};

export const unpinAllTabs = async (tabs: Tab[]) => {
  for (const tab of tabs) {
    await unpinTab(tab.id);
  }
};

export const getRecentActiveTabs = async (): Promise<Tab[]> => {
  const recentActiveTabs = await ChromeSessionStorage.getRecentActiveTabs();
  if (!recentActiveTabs) return [];

  return recentActiveTabs.map((serializedTab) =>
    deserializeToTab(serializedTab),
  );
};

export const updateRecentActiveTabs = async (tabId: number) => {
  const tab = await getTabBy(tabId);
  if (!tab) return;

  const serializedTab = serializeTab(tab);
  const recentActiveTabs = await ChromeSessionStorage.getRecentActiveTabs();
  if (!recentActiveTabs) {
    await ChromeSessionStorage.updateRecentActiveTabs([serializedTab]);
    return;
  }

  const uniqueTabs = recentActiveTabs.filter((recentActiveTab) => {
    const isDuplicated =
      recentActiveTab.id === tab.id ||
      (recentActiveTab.title === tab.title &&
        recentActiveTab.url === tab.url.toString());
    return !isDuplicated;
  });

  const newTabs = [serializedTab, ...uniqueTabs].slice(0, 10);
  await ChromeSessionStorage.updateRecentActiveTabs(newTabs);
};

const getTabBy = async (tabId: number): Promise<Tab | null> => {
  const tab = (await chrome.tabs.get(tabId).catch((error: unknown) => {
    if (error instanceof Error && !error.message.includes("No tab with id:")) {
      console.error(error);
    }
    return null;
  })) as chrome.tabs.Tab | null;
  if (!tab) return null;

  const parsedTab = parseTab(tab);
  const lastAccesses = await ChromeStorage.getTabLastAccesses();
  return applyLastActivatedAt(parsedTab, lastAccesses);
};

export const parseTab = (tab: chrome.tabs.Tab): Tab => {
  return {
    id: tab.id,
    groupId:
      tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE ? null : tab.groupId,
    windowId:
      tab.windowId === chrome.windows.WINDOW_ID_NONE ? null : tab.windowId,
    title: tab.title,
    url: tab.url && tab.url !== "" ? new URL(tab.url) : new URL(tab.pendingUrl),
    favIconUrl:
      tab.favIconUrl && tab.favIconUrl !== "" ? new URL(tab.favIconUrl) : null,
    highlighted: tab.highlighted,
    audible: tab.audible,
    pinned: tab.pinned,
  };
};

export const applyLastActivatedAt = async (
  tab: Tab,
  lastAccesses: {
    local: { [key: string]: { lastActivatedAt: string } };
    session: { [tabId: number]: { lastActivatedAt: string } };
  },
) => {
  const { local, session } = lastAccesses;
  if (session[tab.id]) {
    return {
      ...tab,
      lastActivatedAt: new Date(session[tab.id].lastActivatedAt),
    };
  }

  const key = await ChromeStorage.tabKeyForLastAccessesInLocal(
    tab.title,
    tab.url.toString(),
  );
  if (local[key]) {
    return {
      ...tab,
      lastActivatedAt: new Date(local[key].lastActivatedAt),
    };
  }

  return tab;
};

const serializeTab = (tab: Tab) => {
  return {
    id: tab.id,
    groupId: tab.groupId,
    windowId: tab.windowId,
    title: tab.title,
    url: tab.url.toString(),
    favIconUrl: tab.favIconUrl?.toString(),
    highlighted: false,
    audible: false,
    pinned: false,
    lastActivatedAt: tab.lastActivatedAt?.toISOString(),
  };
};

const deserializeToTab = (
  serializedTab: ChromeSessionStorage.SerializedTab,
): Tab => {
  return {
    id: serializedTab.id,
    groupId: serializedTab.groupId,
    windowId: serializedTab.windowId,
    title: serializedTab.title,
    url: new URL(serializedTab.url),
    favIconUrl: serializedTab.favIconUrl
      ? new URL(serializedTab.favIconUrl)
      : null,
    highlighted: serializedTab.highlighted,
    audible: serializedTab.audible,
    pinned: serializedTab.pinned,
    lastActivatedAt: serializedTab.lastActivatedAt
      ? new Date(serializedTab.lastActivatedAt)
      : null,
  };
};

export const addListenerOnChangeTabs = (callback: () => Promise<void>) => {
  const listener = async () => {
    await callback();
  };
  chrome.tabs.onCreated.addListener(listener);
  chrome.tabs.onActivated.addListener(listener);
  chrome.tabs.onAttached.addListener(listener);
  chrome.tabs.onUpdated.addListener(listener);
  chrome.tabs.onMoved.addListener(listener);
  chrome.tabs.onRemoved.addListener(listener);
  chrome.tabGroups.onUpdated.addListener(listener);
  chrome.windows.onFocusChanged.addListener(listener);

  return listener;
};

export const removeListenerOnChangeTabs = (listener: () => Promise<void>) => {
  chrome.tabs.onCreated.removeListener(listener);
  chrome.tabs.onActivated.removeListener(listener);
  chrome.tabs.onAttached.removeListener(listener);
  chrome.tabs.onUpdated.removeListener(listener);
  chrome.tabs.onMoved.removeListener(listener);
  chrome.tabs.onRemoved.removeListener(listener);
  chrome.tabGroups.onUpdated.removeListener(listener);
  chrome.windows.onFocusChanged.removeListener(listener);
};
