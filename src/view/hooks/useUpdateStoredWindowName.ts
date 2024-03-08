import { useCallback, useContext } from "react";

import { updateStoredWindowName } from "../../data/repository/WindowsRepository";
import { StoredWindowsContext } from "../contexts/StoredWindowsContext";

export const useUpdateStoredWindowName = (): ((
  id: string,
  name: string,
) => Promise<void>) => {
  const { setStoredWindows } = useContext(StoredWindowsContext);

  const callback = useCallback(
    async (id: string, name: string) => {
      const newStoredWindows = await updateStoredWindowName(id, name);
      setStoredWindows(newStoredWindows);
    },
    [setStoredWindows],
  );

  return callback;
};
