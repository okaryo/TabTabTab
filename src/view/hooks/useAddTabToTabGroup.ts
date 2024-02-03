import { useCallback, useContext } from "react";

import { addTabToTabGroup } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useAddTabToTabGroup = (): ((
  tabId: number,
  groupId: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: number, groupId: number) => {
      await addTabToTabGroup(tabId, groupId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
