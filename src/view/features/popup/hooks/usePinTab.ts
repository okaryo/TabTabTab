import { useCallback, useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { pinTab as pin } from "../../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";

export const usePinTab = (): ((tab: Tab) => Promise<void>) => {
  const { windows, setWindows } = useContext(WindowsContext);

  const pinTab = useCallback(
    async (tab: Tab) => {
      await pin(tab.id);
      const newWindows = windows.pinTab(tab);
      setWindows(newWindows);
    },
    [windows, setWindows]
  );

  return pinTab;
};
