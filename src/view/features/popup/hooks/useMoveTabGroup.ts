import { useCallback, useContext } from "react";

import { moveTabGroup } from "../../../../repository/TabGroupRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useMoveTabGroup = (): ((
  groupId: number,
  index: number,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number, index: number) => {
      await moveTabGroup(groupId, index);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
