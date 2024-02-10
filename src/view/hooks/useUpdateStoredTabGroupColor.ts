import { useCallback, useContext } from "react";

import { GroupColor } from "../../model/GroupColor";
import { updateStoredTabGroupColor } from "../../repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";

export const useUpdateStoredTabGroupColor = (): ((
  id: string,
  color: GroupColor,
) => Promise<void>) => {
  const { setStoredTabGroups } = useContext(StoredTabGroupsContext);

  const callback = useCallback(
    async (id: string, color: GroupColor) => {
      const newStoredTabGroups = await updateStoredTabGroupColor(id, color);
      setStoredTabGroups(newStoredTabGroups);
    },
    [setStoredTabGroups],
  );

  return callback;
};
