import { useCallback, useContext } from "react";

import { removeTab } from "../../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useCloseTab = (): ((tabId: number) => Promise<void>) => {
  const { windows, setWindows } = useContext(WindowsContext);

  const closeTab = useCallback(
    async (tabId: number) => {
      await removeTab(tabId);
      const newWindows = windows.removeTabBy(tabId);
      setWindows(newWindows);
    },
    [windows, setWindows],
  );

  return closeTab;
};
