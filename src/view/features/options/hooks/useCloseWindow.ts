import { useCallback, useContext } from "react";

import {
  closeWindow,
  getWindows,
} from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/WindowsContext";

export const useCloseWindow = (): ((id: number) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (id: number) => {
      await closeWindow(id);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
