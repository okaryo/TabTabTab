import { useCallback, useContext } from "react";

import { moveTabOutOfGroup } from "../../../../repository/TabsRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useMoveTabOutOfGroup = (): ((
  tabId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabId: number, index: number) => {
      await moveTabOutOfGroup(tabId, index);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
