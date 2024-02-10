import { useCallback, useContext } from "react";

import { Window } from "../../../../model/Window";
import { closeWindow } from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/WindowsContext";

export const useCloseWindow = (): ((window: Window) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (window: Window) => {
      const newWindows = await closeWindow(window);
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
