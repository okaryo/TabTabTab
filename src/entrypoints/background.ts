import { addTabGroupingListeners } from "../platform/background/AutoTabGrouping";
import { addTabAccessesListener } from "../platform/background/TabActivityTracker";
import { activateTabCleanerScheduler } from "../platform/background/TabCleanerScheduler";
import { addToolBarActions } from "../platform/background/ToolBarAction";

if (import.meta.env.DEV) {
  chrome.action.setBadgeText({ text: "DEV" });
}

// TabActivityTracker
addTabAccessesListener();

// TabCleanerScheduler
activateTabCleanerScheduler();

// AutoTabGrouping
addTabGroupingListeners();

// ToolBarAction
addToolBarActions();
