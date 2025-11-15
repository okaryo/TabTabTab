import { addTabGroupingListeners } from "../background/AutoTabGrouping";
import { addTabAccessesListener } from "../background/TabActivityTracker";
import { activateTabCleanerScheduler } from "../background/TabCleanerScheduler";
import { addToolBarActions } from "../background/ToolBarAction";

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
