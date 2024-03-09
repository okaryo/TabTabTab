export namespace ChromeSessionStorage {
  const RECENT_ACTIVE_TABS_KEY = "recent_active_tabs";
  const TAB_LAST_ACCESSES_KEY = "tab_last_accesses_in_session";

  // RecentActiveTabs
  export type SerializedTab = {
    id: number;
    groupId: number | null;
    windowId: number | null;
    title: string;
    url: string;
    favIconUrl: string | null;
    active: boolean;
    audible: boolean;
    pinned: boolean;
    discarded: boolean;
    lastActivatedAt: string | null;
  };
  type RecentActiveTabsStorageObject = {
    [RECENT_ACTIVE_TABS_KEY]: SerializedTab[];
  };
  export const getRecentActiveTabs = async () => {
    const { [RECENT_ACTIVE_TABS_KEY]: recentActiveTabs } =
      (await chrome.storage.session.get(
        RECENT_ACTIVE_TABS_KEY,
      )) as RecentActiveTabsStorageObject;
    return recentActiveTabs;
  };
  export const updateRecentActiveTabs = async (tabs: SerializedTab[]) => {
    return chrome.storage.session.set({
      [RECENT_ACTIVE_TABS_KEY]: tabs,
    });
  };

  // TabLastAccesses
  type TabLastAccessesStorageObject = {
    [TAB_LAST_ACCESSES_KEY]: {
      [tabHashKey: string]: {
        lastActivatedAt: string;
      };
    };
  };
  export const getTabLastAccesses = async () => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccessesInSession = {} } =
      (await chrome.storage.session.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;

    return lastAccessesInSession;
  };
  export const updateTabLastAccesses = async (
    tabId: number,
    lastActivatedAt: Date,
  ) => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccessesInSession = {} } =
      (await chrome.storage.session.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;
    await chrome.storage.session.set({
      [TAB_LAST_ACCESSES_KEY]: {
        ...lastAccessesInSession,
        [tabId]: {
          lastActivatedAt: lastActivatedAt.toISOString(),
        },
      },
    });
  };
  export const cleanupTabLastAccesses = async (tabId: number) => {
    const { [TAB_LAST_ACCESSES_KEY]: lastAccesses = {} } =
      (await chrome.storage.session.get(
        TAB_LAST_ACCESSES_KEY,
      )) as TabLastAccessesStorageObject;
    delete lastAccesses[tabId];
    await chrome.storage.session.set({
      [TAB_LAST_ACCESSES_KEY]: lastAccesses,
    });
  };
}
