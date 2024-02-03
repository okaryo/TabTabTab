import { useCallback, useContext } from "react";

import { GroupColor } from "../../model/GroupColor";
import { updateTabGroupColor } from "../../repository/TabGroupRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useUpdateTabGroupColor = (): ((
  groupId: number,
  color: GroupColor,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number, color: GroupColor) => {
      await updateTabGroupColor(groupId, color);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
