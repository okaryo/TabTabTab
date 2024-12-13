import { navigateToOptionsPage } from "../data/repository/SettingsRepository";
import {
  getTabGroupSetting,
  groupTabsBySetting,
} from "../data/repository/TabGroupSettingRepository";
import { getWindows, saveWindow } from "../data/repository/WindowsRepository";
import t from "../i18n/Translations";

const idPrefix = import.meta.env.DEV ? "dev_" : "";
const saveCurrentWindowId = `${idPrefix}saveCurrentWindow`;
const groupTabsNowId = `${idPrefix}groupTabsNow`;
const openDashboardId = `${idPrefix}openDashboard`;

export const addToolBarActions = () => {
  chrome.contextMenus.create({
    id: saveCurrentWindowId,
    title: t.saveCurrentWindow,
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: groupTabsNowId,
    title: t.tabGroupingGroupTabsNow,
    contexts: ["action"],
  });
  chrome.contextMenus.create({
    id: openDashboardId,
    title: t.openDashboard,
    contexts: ["action"],
  });
};

chrome.contextMenus.onClicked.addListener(async (info) => {
  switch (info.menuItemId) {
    case saveCurrentWindowId: {
      const windows = await getWindows();
      const currentWindow = windows.find((w) => w.focused);
      await saveWindow(currentWindow);

      break;
    }
    case groupTabsNowId: {
      const setting = await getTabGroupSetting();
      await groupTabsBySetting(setting);

      break;
    }
    case openDashboardId:
      navigateToOptionsPage();

      break;
  }
});
