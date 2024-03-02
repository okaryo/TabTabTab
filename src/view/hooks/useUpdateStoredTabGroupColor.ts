import { useCallback, useContext } from "react";
import { TabGroupColor } from "../../model/TabContainer";
import { updateStoredTabGroupColor } from "../../repository/TabGroupRepository";
import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";

export const useUpdateStoredTabGroupColor = (): ((
  id: string,
  color: TabGroupColor,
) => Promise<void>) => {
  const { setStoredTabGroups } = useContext(StoredTabGroupsContext);

  const callback = useCallback(
    async (id: string, color: TabGroupColor) => {
      const newStoredTabGroups = await updateStoredTabGroupColor(id, color);
      setStoredTabGroups(newStoredTabGroups);
    },
    [setStoredTabGroups],
  );

  return callback;
};
