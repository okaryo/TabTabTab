import {
  cleanupTabLastActivatedAt,
  updateRecentActiveTabs,
  updateTabLastActivatedAt,
} from "../data/repository/TabsRepository";

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
    cleanupTabLastActivatedAt(tabId);
  });
};
