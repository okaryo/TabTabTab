import { useCallback, useContext } from "react";

import { moveTab, pinTab } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useMoveTabFromPinnedToPinned = (): ((
  tabId: number,
  sourceWindowId: number,
  destWindowId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (
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
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
