import { useCallback, useContext } from "react";

import { saveStoredTabGroup } from "../../data/repository/TabGroupRepository";
import { TabGroup } from "../../model/TabContainer";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";

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
