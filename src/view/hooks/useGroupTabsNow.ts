import { useCallback, useContext } from "react";

import { TabGroupSetting } from "../../model/TabGroupSetting";
import { groupTabsBySetting } from "../../repository/TabGroupSettingRepository";
import { getWindows } from "../../repository/WindowsRepository";
import { WindowsContext } from "../contexts/WindowsContext";

export const useGroupTabsNow = (): ((
  setting: TabGroupSetting,
) => Promise<void>) => {
  const { setWindows } = useContext(WindowsContext);

  const callback = useCallback(
    async (setting: TabGroupSetting) => {
      await groupTabsBySetting(setting);
      const newWindows = await getWindows();
      setWindows(newWindows);
    },
    [setWindows],
  );

  return callback;
};
