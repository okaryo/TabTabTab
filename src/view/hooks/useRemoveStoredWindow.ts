import { useCallback, useContext } from "react";

import { removeStoredWindow } from "../../repository/WindowsRepository";
import { StoredWindowsContext } from "../contexts/StoredWindows";

export const useRemoveStoredWindow = (): ((id: string) => Promise<void>) => {
  const { setStoredWindows } = useContext(StoredWindowsContext);

  const callback = useCallback(
    async (id: string) => {
      const newStoredWindows = await removeStoredWindow(id);
      setStoredWindows(newStoredWindows);
    },
    [setStoredWindows],
  );

  return callback;
};
