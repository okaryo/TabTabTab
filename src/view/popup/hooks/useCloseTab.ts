import { useCallback, useContext } from "react";

import { TabId } from "../../../model/TabId";
import { removeTab } from "../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useCloseTab = (): ((tabId: TabId) => Promise<void>) => {
  const { windows, setWindows } = useContext(WindowsContext);

  const closeTab = useCallback(
    async (tabId: TabId) => {
      await removeTab(tabId);
      const newWindows = windows.removeTabBy(tabId);
      setWindows(newWindows);
    },
    [windows, setWindows]
  );

  return closeTab;
};
