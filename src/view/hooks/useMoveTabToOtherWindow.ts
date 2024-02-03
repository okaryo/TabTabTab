import { useCallback, useContext } from "react";

import { TabId } from "../../model/Tab";
import { WindowId } from "../../model/Window";
import { moveTabToOtherWindow } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useMoveTabToOtherWindow = (): ((
  tabId: TabId,
  WindowId: WindowId,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: TabId, windowId: WindowId) => {
      await moveTabToOtherWindow(tabId, windowId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
