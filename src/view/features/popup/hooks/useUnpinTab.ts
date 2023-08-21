import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { unpinTab } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useUnpinTab = (): ((tab: Tab) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tab: Tab) => {
      await unpinTab(tab.id);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
