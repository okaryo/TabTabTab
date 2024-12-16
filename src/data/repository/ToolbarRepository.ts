import type { ToolbarSetting } from "../../model/ToolbarSetting";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const setToolbarIconClickOpenView = async (
  view: ToolbarSetting["iconClickOpenView"],
) => {
  const setting = await ChromeLocalStorage.getToolbarSetting();
  const newSetting = { ...setting, iconClickOpenView: view };
  await ChromeLocalStorage.updateToolbarSetting(newSetting);

  switch (view) {
    case "popup":
      await setToolbarIconBehaviorToOpenPopup();
      break;
    case "sidePanel":
      await setToolbarIconBehaviorToOpenSidePanel();
      break;
    case "dashboard":
      await setToolbarIconBehaviorToNone();
      break;
    default:
      throw new Error(`Invalid view: ${view}`);
  }

  return newSetting;
};

export const setToolbarIconBehaviorToOpenPopup = async () => {
  await disableOpenSidePanel();
  await chrome.action.setPopup({ popup: "popup.html" });
};

export const setToolbarIconBehaviorToOpenSidePanel = async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
};

export const setToolbarIconBehaviorToNone = async () => {
  await disableOpenSidePanel();
  await chrome.action.setPopup({ popup: "" });
};

const disableOpenSidePanel = async () => {
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
};
