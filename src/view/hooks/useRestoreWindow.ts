import { useCallback, useContext } from "react";

import { StoredWindow } from "../../model/Window";
import { getWindows, restoreWindow } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useRestoreWindow = (): ((
  window: StoredWindow,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (window: StoredWindow) => {
      await restoreWindow(window);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
