import { useCallback, useContext } from "react";

import { collapseTabGroup } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useCollapseTabGroup = (): ((groupId: number) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number) => {
      await collapseTabGroup(groupId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
