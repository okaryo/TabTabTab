import { createGroupWithTabs } from "../../data/repository/TabGroupRepository";
import { addTabsToGroup } from "../../data/repository/TabsRepository";
import {
  type Window,
  findGroupsByName,
  flatTabsInWindows,
} from "../../model/Window";

const groupTabsBySearchKeyword = async (
  keyword: string,
  windows: Window[],
  tabIds: number[],
) => {
  const pinnedTabs = flatTabsInWindows(windows).filter((tab) => tab.pinned);
  const tabIdsExcludingPinned = tabIds.filter((tabId) =>
    pinnedTabs.some((tab) => tab.id === tabId),
  );

  const sameNameGroups = findGroupsByName(keyword, windows);
  if (sameNameGroups.length > 0) {
    await addTabsToGroup(tabIdsExcludingPinned, sameNameGroups[0].id);
  }

  await createGroupWithTabs(keyword, tabIdsExcludingPinned);
};

export default groupTabsBySearchKeyword;
