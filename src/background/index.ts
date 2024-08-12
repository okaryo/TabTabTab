import { addTabGroupingListeners } from "./AutoTabGrouping";
import { addTabAccessesListener } from "./TabActivityTracker";
import { activateTabCleanerScheduler } from "./TabCleanerScheduler";

if (import.meta.env.DEV) {
  chrome.action.setBadgeText({ text: 'DEV' });
}

// TabActivityTracker
addTabAccessesListener();

// TabCleanerScheduler
activateTabCleanerScheduler();

// AutoTabGrouping
addTabGroupingListeners();
