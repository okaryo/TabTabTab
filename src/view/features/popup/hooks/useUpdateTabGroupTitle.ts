import { useCallback, useContext } from "react";

import { updateTabGroupTitle } from "../../../../repository/TabGroupRepository";
import { getWindows } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useUpdateTabGroupTitle = (): ((
  groupId: number,
  title: string,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (groupId: number, title: string) => {
      await updateTabGroupTitle(groupId, title);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
