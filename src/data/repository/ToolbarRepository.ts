import type { ToolbarSetting } from "../../model/ToolbarSetting";
import { ChromeLocalStorage } from "../storage/ChromeLocalStorage";

export const setToolbarIconClickOpenView = async (
  view: ToolbarSetting["iconClickOpenView"],
) => {
  const setting = await ChromeLocalStorage.getToolbarSetting();
  const newSetting = { ...setting, iconClickOpenView: view };
  await ChromeLocalStorage.updateToolbarSetting(newSetting);
  setToolbarIconBehavior(view);
  return newSetting;
};

export const setToolbarIconBehavior = async (
  view: ToolbarSetting["iconClickOpenView"],
) => {
  switch (view) {
    case "popup":
      await setToolbarIconBehaviorToOpenPopup();
      break;
    case "sidePanel":
      await setToolbarIconBehaviorToOpenSidePanel();
      break;
    default:
      // NOTE: Fallback for legacy "dashboard" value from previous versions
      console.error(`Unknown toolbar icon click view: ${view}`);
      await setToolbarIconBehaviorToOpenPopup();
  }
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
