import { useCallback, useContext } from "react";

import { TabId } from "../../../../model/Tab";
import {
  addWindowWithTab,
  getWindows,
} from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useAddWindowWithTab = (): ((tabId: TabId) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: TabId) => {
      await addWindowWithTab(tabId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
