import type { ToolbarSetting } from "../../model/ToolbarSetting";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const setToolbarIconBehaviorToOpenDefaultPopup =
  async (): Promise<ToolbarSetting> => {
    const setting = await ChromeLocalStorage.getToolbarSetting();
    const newSetting = { ...setting, openDashboardWhenIconClicked: false };

    await ChromeLocalStorage.updateToolbarSetting(newSetting);
    await chrome.action.setPopup({ popup: "popup.html" });

    return newSetting;
  };

export const setToolbarIconBehaviorToOpenDashboard =
  async (): Promise<ToolbarSetting> => {
    const setting = await ChromeLocalStorage.getToolbarSetting();
    const newSetting = { ...setting, openDashboardWhenIconClicked: true };

    await ChromeLocalStorage.updateToolbarSetting(newSetting);
    await chrome.action.setPopup({ popup: "" });

    return newSetting;
  };
