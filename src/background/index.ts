/* eslint @typescript-eslint/no-floating-promises: 0 */
import { addTabGroupingListeners } from "./AutoTabGrouping";
import {
  addListenerOnTabActivated,
  addListenerOnTabClosed,
} from "./TabActivityTracker";
import { activateTabCleanerScheduler } from "./TabCleanerScheduler";

// TabActivityTracker
addListenerOnTabActivated();
addListenerOnTabClosed();

// TabCleanerScheduler
activateTabCleanerScheduler();

// AutoTabGrouping
addTabGroupingListeners();
