import { useCallback, useContext } from "react";

import { Tab, isSamePageTabs } from "../../../../model/Tab";
import { flatTabsInWindows } from "../../../../model/Window";
import { removeTabs } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useResolveDuplicateTabs = (): ((tab: Tab) => Promise<void>) => {
  const { windows, setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tab: Tab) => {
      const allTabs = flatTabsInWindows(windows);
      const duplicateTabs = allTabs.filter((t) => isSamePageTabs(t, tab));
      const duplicateTabIds = duplicateTabs.map((t) => t.id);
      await removeTabs(duplicateTabIds);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [windows, setWindows],
  );

  return callback;
};
