import { useCallback, useContext } from "react";

import { TabGroup } from "../../model/TabContainer";
import { closeTabGroup } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useCloseTabGroup = (): ((tabGroup: TabGroup) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabGroup: TabGroup) => {
      await closeTabGroup(tabGroup);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
