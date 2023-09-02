import { useCallback, useContext } from "react";

import { expandTabGroup } from "../../../../repository/TabGroupRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useExpandTabGroup = (): ((groupId: number) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number) => {
      await expandTabGroup(groupId);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
