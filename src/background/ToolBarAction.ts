import t from "../i18n/Translations";
import {
  getToolbarSetting,
  navigateToOptionsPage,
} from "../platform/repository/SettingsRepository";
import {
  getTabGroupSetting,
  groupTabsBySetting,
} from "../platform/repository/TabGroupSettingRepository";
import { setToolbarIconBehavior } from "../platform/repository/ToolbarRepository";
import {
  getWindows,
  saveWindow,
} from "../platform/repository/WindowsRepository";

const saveCurrentWindowId = "saveCurrentWindow";
const groupTabsNowId = "groupTabsNow";
const openDashboardId = "openDashboard";

export const addToolBarActions = async () => {
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

  const toolbarSetting = await getToolbarSetting();
  setToolbarIconBehavior(toolbarSetting.iconClickOpenView);
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
