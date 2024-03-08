import { useCallback, useContext } from "react";

import { updateStoredTabGroupName } from "../../data/repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";

export const useUpdateStoredTabGroupName = (): ((
  id: string,
  name: string,
) => Promise<void>) => {
  const { setStoredTabGroups } = useContext(StoredTabGroupsContext);

  const callback = useCallback(
    async (id: string, name: string) => {
      const newStoredTabGroups = await updateStoredTabGroupName(id, name);
      setStoredTabGroups(newStoredTabGroups);
    },
    [setStoredTabGroups],
  );

  return callback;
};
