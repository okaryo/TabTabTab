import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { flatTabsInWindows } from "../../../../model/Window";
import { removeTabs } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useResolveDuplicateTabs = (): ((tab: Tab) => Promise<void>) => {
  const { windows, setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tab: Tab) => {
      const allTabs = flatTabsInWindows(windows);
      const duplicateTabs = allTabs.filter((t) => {
        return (
          tab.id !== t.id &&
          tab.title === t.title &&
          tab.url.href === t.url.href
        );
      })
      const duplicateTabIds = duplicateTabs.map((t) => t.id);
      await removeTabs(duplicateTabIds);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [windows, setWindows],
  );

  return callback;
};
