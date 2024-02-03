import { useCallback, useContext } from "react";

import { unpinTab } from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/Windows";

export const useUnpinTab = (): ((id: number) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (id: number) => {
      await unpinTab(id);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
