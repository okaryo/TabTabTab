import { useCallback, useContext } from "react";

import { removeStoredTabGroup } from "../../data/repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";

export const useRemoveStoredTabGroup = (): ((id: string) => Promise<void>) => {
  const { setStoredTabGroups } = useContext(StoredTabGroupsContext);

  const callback = useCallback(
    async (id: string) => {
      const newStoredTabGroups = await removeStoredTabGroup(id);
      setStoredTabGroups(newStoredTabGroups);
    },
    [setStoredTabGroups],
  );

  return callback;
};
