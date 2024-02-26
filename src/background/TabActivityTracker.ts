/* eslint @typescript-eslint/no-floating-promises: 0 */
import { cleanupTabLastAccesses } from "../repository/ChromeStorage";
import {
  updateRecentActiveTabs,
  updateTabLastActivatedAt,
} from "../repository/TabsRepository";

export const addTabAccessesListener = () => {
  chrome.tabs.onCreated.addListener((tab) => {
    updateTabLastActivatedAt(tab.id);
    updateRecentActiveTabs(tab.id);
  });
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo;
    updateTabLastActivatedAt(tabId);
    updateRecentActiveTabs(tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId) => {
    updateTabLastActivatedAt(tabId, { onlyActiveTab: true });
    updateRecentActiveTabs(tabId);
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    cleanupTabLastAccesses(tabId);
  });
};
