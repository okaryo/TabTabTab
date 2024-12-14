import {
  getToolbarSetting,
  navigateToOptionsPage,
} from "../data/repository/SettingsRepository";
import {
  getTabGroupSetting,
  groupTabsBySetting,
} from "../data/repository/TabGroupSettingRepository";
import { getWindows, saveWindow } from "../data/repository/WindowsRepository";
import t from "../i18n/Translations";

const saveCurrentWindowId = "saveCurrentWindow";
const groupTabsNowId = "groupTabsNow";
const openDashboardId = "openDashboard";

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

  chrome.action.onClicked.addListener(async () => {
    const toolbarSetting = await getToolbarSetting();
    if (toolbarSetting.openDashboardWhenIconClicked) {
      navigateToOptionsPage();
    }
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
