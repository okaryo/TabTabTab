import { addTabGroupingListeners } from "./AutoTabGrouping";
import { addTabAccessesListener } from "./TabActivityTracker";
import { activateTabCleanerScheduler } from "./TabCleanerScheduler";

// TabActivityTracker
addTabAccessesListener();

// TabCleanerScheduler
activateTabCleanerScheduler();

// AutoTabGrouping
addTabGroupingListeners();
