/* eslint @typescript-eslint/no-floating-promises: 0 */
import { addKeyboardShortcutsListener } from "./KeyboardShortcuts";
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

// KeyboardShortcuts
addKeyboardShortcutsListener();
