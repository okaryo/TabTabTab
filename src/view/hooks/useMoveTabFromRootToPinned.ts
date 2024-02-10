import { useCallback, useContext } from "react";

import { moveTab, pinTab } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useMoveTabFromRootToPinned = (): ((
  tabId: number,
  windowId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: number, windowId: number, index: number) => {
      await moveTab(tabId, windowId, -1);
      await pinTab(tabId);
      await moveTab(tabId, windowId, index);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
