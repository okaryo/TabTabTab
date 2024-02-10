import { useCallback, useContext } from "react";

import { StoredTabGroup } from "../../model/TabContainer";
import { restoreTabGroup } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useRestoreTabGroup = (): ((
  tabGroup: StoredTabGroup,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabGroup: StoredTabGroup) => {
      await restoreTabGroup(tabGroup);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
