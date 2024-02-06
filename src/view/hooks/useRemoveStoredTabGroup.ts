import { useCallback, useContext } from "react";

import { removeStoredTabGroup } from "../../repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroups";

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
