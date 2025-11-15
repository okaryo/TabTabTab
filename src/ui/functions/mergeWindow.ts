import { isPinned, isTab, isTabGroup } from "../../model/TabContainer";
import type { Window } from "../../model/Window";
import { moveTabGroup } from "../../platform/repository/TabGroupRepository";
import { moveTab, pinTab } from "../../platform/repository/TabsRepository";

const mergeWindow = async (destWindowId: number, sourceWindow: Window) => {
  for (const child of sourceWindow.children) {
    if (isPinned(child)) {
      for (const tab of child.children) {
        await moveTab(tab.id, destWindowId, -1);
        await pinTab(tab.id);
      }
    }
    if (isTabGroup(child)) {
      await moveTabGroup(child.id, sourceWindow.id, destWindowId, -1);
    }
    if (isTab(child)) {
      await moveTab(child.id, destWindowId, -1);
    }
  }
};

export default mergeWindow;
