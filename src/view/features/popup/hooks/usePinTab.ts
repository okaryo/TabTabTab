import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { pinTab as pin } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const usePinTab = (): ((tab: Tab) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const pinTab = useCallback(
    async (tab: Tab) => {
      await pin(tab.id);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return pinTab;
};
