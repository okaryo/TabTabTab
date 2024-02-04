import { useCallback, useContext } from "react";

import { isPinned, isTab, isTabGroup } from "../../model/TabContainer";
import { Window } from "../../model/Window";
import { moveTabGroup } from "../../repository/TabGroupRepository";
import { moveTab, pinTab } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useMergeWindow = (): ((
  destWindowId: number,
  sourceWindow: Window,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (destWindowId: number, sourceWindow: Window) => {
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
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
