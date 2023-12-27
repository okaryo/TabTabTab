import { useCallback, useContext } from "react";

import { WindowId } from "../../../../model/Window";
import { moveTabGroupToOtherWindow } from "../../../../repository/TabGroupRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useMoveTabGroupToOtherWindow = (): ((
  groupId: number,
  WindowId: WindowId,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number, windowId: WindowId) => {
      await moveTabGroupToOtherWindow(groupId, windowId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
