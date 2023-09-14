import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { unpinAllTabs } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useUnpinAllTabs = (): ((tabs: Tab[]) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabs: Tab[]) => {
      await unpinAllTabs(tabs);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
