/* eslint @typescript-eslint/no-floating-promises: 0 */
import {
  deleteLastActivatedAtOfTab,
  updateLastActivatedAtOfTab,
  updateRecentActiveTabs,
} from "../repository/TabsRepository";

export const addListenerOnTabActivated = () => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo;
    updateLastActivatedAtOfTab(tabId);
    updateRecentActiveTabs(tabId);
  });
  chrome.tabs.onAttached.addListener((tabId) => {
    updateLastActivatedAtOfTab(tabId);
    updateRecentActiveTabs(tabId);
  });
  chrome.tabs.onHighlighted.addListener((highlightInfo) => {
    const { tabIds } = highlightInfo;
    for (const tabId of tabIds) {
      updateLastActivatedAtOfTab(tabId);
      updateRecentActiveTabs(tabId);
    }
  });
  chrome.tabs.onMoved.addListener((tabId) => {
    updateLastActivatedAtOfTab(tabId);
    updateRecentActiveTabs(tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId) => {
    updateLastActivatedAtOfTab(tabId);
    updateRecentActiveTabs(tabId);
  });
};

export const addListenerOnTabClosed = () => {
  chrome.tabs.onDetached.addListener((tabId) => {
    deleteLastActivatedAtOfTab(tabId);
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    deleteLastActivatedAtOfTab(tabId);
  });
};
