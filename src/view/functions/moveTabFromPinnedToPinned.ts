import { moveTab, pinTab } from "../../data/repository/TabsRepository";

export const moveTabFromPinnedToPinned = async (
  tabId: number,
  sourceWindowId: number,
  destWindowId: number,
  index: number,
) => {
  if (sourceWindowId === destWindowId) {
    await moveTab(tabId, sourceWindowId, index);
  } else {
    await moveTab(tabId, destWindowId, -1);
    await pinTab(tabId);
    await moveTab(tabId, destWindowId, index);
  }
};
