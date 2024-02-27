import { moveTab, pinTab } from "../../repository/TabsRepository";

export const moveTabFromRootToPinned = async (
  tabId: number,
  windowId: number,
  index: number,
) => {
  await moveTab(tabId, windowId, -1);
  await pinTab(tabId);
  await moveTab(tabId, windowId, index);
};
