import { useCallback, useContext } from "react";

import { removeTab } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useCloseTab = (): ((tabId: number) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const closeTab = useCallback(
    async (tabId: number) => {
      await removeTab(tabId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return closeTab;
};
