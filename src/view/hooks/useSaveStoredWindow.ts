import { useCallback, useContext } from "react";

import { Window } from "../../model/Window";
import { saveStoredWindow } from "../../repository/WindowsRepository";
import { StoredWindowsContext } from "../contexts/StoredWindowsContext";

export const useSaveStoredWindow = (): ((window: Window) => Promise<void>) => {
  const { setStoredWindows } = useContext(StoredWindowsContext);

  const callback = useCallback(
    async (window: Window) => {
      const newStoredWindows = await saveStoredWindow(window);
      setStoredWindows(newStoredWindows);
    },
    [setStoredWindows],
  );

  return callback;
};
