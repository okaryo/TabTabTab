import { useCallback, useContext } from "react";

import { TabGroup } from "../../../../model/TabContainer";
import {
  addWindowWithTabGroup,
  getWindows,
} from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useAddWindowWithTabGroup = (): ((
  tabGroup: TabGroup,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (tabGroup: TabGroup) => {
      await addWindowWithTabGroup(tabGroup);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
