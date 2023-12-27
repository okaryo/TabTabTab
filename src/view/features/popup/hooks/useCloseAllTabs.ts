import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { closeAllTabs } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useCloseAllTabs = (): ((tabs: Tab[]) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabs: Tab[]) => {
      await closeAllTabs(tabs);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
