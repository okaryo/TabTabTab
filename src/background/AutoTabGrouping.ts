import { parse } from "tldts";
import { getTabGroupSetting } from "../data/repository/TabGroupSettingRepository";
import { TabGroupSetting } from "../model/TabGroupSetting";

export const addTabGroupingListeners = () => {
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  chrome.tabs.onRemoved.addListener(onTabRemoved);
  chrome.tabs.onActivated.addListener(onTabActivated);
};

const onTabUpdated = async (
  _: number,
  info: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
) => {
  if (info.status !== "loading" && info.status !== "complete") return;

  const setting = await getTabGroupSetting();
  if (!setting.enabledAutoGrouping) return;

  if (!tab || tab.pinned) return;
  const currentWindow = await chrome.windows.getCurrent();
  if (
    setting.applyAutoGroupingToCurrentTabOnly &&
    (!tab.active || tab.windowId !== currentWindow.id)
  ) {
    return;
  }

  await organizeTabsByGroupingRule(tab, setting);
};

const organizeTabsByGroupingRule = async (
  tab: chrome.tabs.Tab,
  setting: TabGroupSetting,
) => {
  const isTabInGroup = tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE;
  const groupIdMatchingRule = await findGroupIdMatchingRule(
    tab,
    setting.groupBy,
  );

  if (isTabInGroup && groupIdMatchingRule !== tab.groupId) {
    await chrome.tabs.ungroup(tab.id);
  }

  if (groupIdMatchingRule !== null) {
    await moveTabToGroup(tab.id, groupIdMatchingRule);
  } else {
    await createGroupIfExistMatchingTabs(tab, setting.groupBy);
  }

  if (setting.ungroupSingleTabGroups) {
    await ungroupSingleTabGroups(tab.windowId);
  }
};

const findGroupIdMatchingRule = async (
  targetTab: chrome.tabs.Tab,
  groupBy: "domain" | "subdomain",
): Promise<number | null> => {
  const tabs = await chrome.tabs.query({
    windowId: targetTab.windowId,
    pinned: false,
  });
  const tabsInGroup = tabs.filter(
    (tab) => tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE,
  );
  const targetGroupName = getGroupNameBy(
    targetTab.url || targetTab.pendingUrl,
    groupBy,
  );

  const tabsCategorizedByGroupId = tabsInGroup.reduce(
    (categorizedTabs, tab) => {
      const stringGroupId = tab.groupId.toString();
      categorizedTabs[stringGroupId] = categorizedTabs[stringGroupId] || [];
      categorizedTabs[stringGroupId].push(tab);
      return categorizedTabs;
    },
    {} as { [key: string]: chrome.tabs.Tab[] },
  );
  for (const groupId in tabsCategorizedByGroupId) {
    const isAllSameMatchingRuleGroup = tabsCategorizedByGroupId[groupId].every(
      (tab) =>
        getGroupNameBy(tab.url || tab.pendingUrl, groupBy) === targetGroupName,
    );
    if (isAllSameMatchingRuleGroup) return Number(groupId);
  }
  return null;
};

const createGroupIfExistMatchingTabs = async (
  targetTab: chrome.tabs.Tab,
  groupBy: "domain" | "subdomain",
) => {
  const tabs = await chrome.tabs.query({
    windowId: targetTab.windowId,
    pinned: false,
  });
  const targetGroupName = getGroupNameBy(
    targetTab.url || targetTab.pendingUrl,
    groupBy,
  );
  if (!targetGroupName) return;

  const sameGroupNameTabs = tabs.filter(
    (tab) =>
      getGroupNameBy(tab.url || tab.pendingUrl, groupBy) === targetGroupName,
  );
  if (sameGroupNameTabs.length > 1) {
    const tabIds = sameGroupNameTabs.map((tab) => tab.id);
    const groupId = await chrome.tabs.group({ tabIds });
    try {
      await chrome.tabGroups.update(groupId, { title: targetGroupName });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        !error.message.includes("No group with id:")
      ) {
        console.error(error);
      }
    }
  }
};

const getGroupNameBy = (
  url: string,
  groupBy: "domain" | "subdomain",
): string | undefined => {
  const parsedUrl = parse(url);
  if (!parsedUrl.domainWithoutSuffix) return;

  if (groupBy === "domain") {
    return parsedUrl.domainWithoutSuffix;
  }
  if (groupBy === "subdomain") {
    return ["", "www"].includes(parsedUrl.subdomain)
      ? parsedUrl.domainWithoutSuffix
      : `${parsedUrl.subdomain}.${parsedUrl.domainWithoutSuffix}`;
  }
};

const moveTabToGroup = async (tabId: number, groupId: number) => {
  await chrome.tabs.group({ tabIds: [tabId], groupId });
};

const onTabActivated = async (info: chrome.tabs.TabActiveInfo) => {
  const setting = await getTabGroupSetting();
  if (!setting.enabledAutoGrouping || !setting.collapseWhenNoInUse) return;

  await collapseUnusedGroups(info.tabId, info.windowId);
};

const onTabRemoved = async (_: number, info: chrome.tabs.TabRemoveInfo) => {
  const setting = await getTabGroupSetting();
  if (!setting.enabledAutoGrouping || !setting.ungroupSingleTabGroups) return;

  await ungroupSingleTabGroups(info.windowId);
};

const collapseUnusedGroups = async (activeTabId: number, windowId: number) => {
  const tabs = await chrome.tabs.query({ windowId });
  const groups: { [key: string]: chrome.tabs.Tab[] } = {};
  for (const tab of tabs) {
    if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const stringGroupId = tab.groupId.toString();
      if (!groups[stringGroupId]) groups[stringGroupId] = [];

      groups[stringGroupId].push(tab);
    }
  }

  const MAX_RETRIES = 5;
  const RETRY_DELAY = 50;

  const collapsePromises = Object.keys(groups).map(async (groupId) => {
    const groupTabs = groups[groupId];
    const containsActiveTab = groupTabs.some((tab) => tab.id === activeTabId);
    if (!containsActiveTab) {
      // NOTE: Retry with a delay due to the possible error:
      // Uncaught (in promise) Error: Tabs cannot be edited right now (user may be dragging a tab).
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          await chrome.tabGroups.update(Number(groupId), { collapsed: true });
          break;
        } catch (_) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
  });
  await Promise.all(collapsePromises);
};

const ungroupSingleTabGroups = async (windowId: number) => {
  const tabs = await chrome.tabs.query({ windowId });
  const groups: { [key: string]: number[] } = {};
  for (const tab of tabs) {
    if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const stringGroupId = tab.groupId.toString();
      if (!groups[stringGroupId]) groups[stringGroupId] = [];

      groups[stringGroupId].push(tab.id);
    }
  }

  await Promise.all(
    Object.keys(groups).map(async (groupId) => {
      if (groups[groupId].length === 1) {
        await chrome.tabs.ungroup(groups[groupId]);
      }
    }),
  );
};
