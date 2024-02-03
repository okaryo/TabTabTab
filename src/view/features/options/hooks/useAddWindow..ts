import { useCallback, useContext } from "react";

import {
  addWindow,
  getWindows,
} from "../../../../repository/WindowsRepository";
import { WindowsContext } from "../../../contexts/Windows";

export const useAddWindow = (): (() => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(async () => {
    await addWindow();
    const newWindows = await getWindows();
    setWindows(newWindows);
  }, [setWindows]);

  return callback;
};
