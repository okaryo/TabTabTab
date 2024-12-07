import { createGroupWithTabs } from "../../data/repository/TabGroupRepository";
import { addTabsToGroup } from "../../data/repository/TabsRepository";
import { type Window, findGroupsByName } from "../../model/Window";

const groupTabsBySearchKeyword = async (
  keyword: string,
  windows: Window[],
  tabIds: number[],
) => {
  const sameNameGroups = findGroupsByName(keyword, windows);
  if (sameNameGroups.length > 0) {
    await addTabsToGroup(tabIds, sameNameGroups[0].id);
  }

  await createGroupWithTabs(keyword, tabIds);
};

export default groupTabsBySearchKeyword;
