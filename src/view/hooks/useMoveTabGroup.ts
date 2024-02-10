import { useCallback, useContext } from "react";

import { moveTabGroup } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useMoveTabGroup = (): ((
  groupId: number,
  currentWindowId: number,
  destWindowId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (
      groupId: number,
      currentWindowId: number,
      destWindowId: number,
      index: number,
    ) => {
      await moveTabGroup(groupId, currentWindowId, destWindowId, index);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
