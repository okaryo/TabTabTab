import { useCallback, useContext } from "react";

import { addToNewGroup } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useAddTabToNewGroup = (): ((
  tabId: number,
  windowId: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: number, windowId: number) => {
      await addToNewGroup(tabId, windowId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
