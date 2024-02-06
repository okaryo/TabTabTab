import { useCallback, useContext } from "react";

import { TabGroup } from "../../model/TabContainer";
import { saveStoredTabGroup } from "../../repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroups";

export const useSaveStoredTabGroup = (): ((
  tabGroup: TabGroup,
) => Promise<void>) => {
  const { setStoredTabGroups } = useContext(StoredTabGroupsContext);

  const callback = useCallback(
    async (tabGroup: TabGroup) => {
      const newStoredTabGroups = await saveStoredTabGroup(tabGroup);
      setStoredTabGroups(newStoredTabGroups);
    },
    [setStoredTabGroups],
  );

  return callback;
};
