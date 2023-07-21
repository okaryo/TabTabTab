/* eslint @typescript-eslint/no-floating-promises: 0 */
import {
  deleteLastActivatedAtOfTab,
  udpateLastActivatedAtOfTab,
} from "../repository/TabsRepository";

export const addListenerOnTabActivated = () => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo;
    udpateLastActivatedAtOfTab(tabId);
  });
  chrome.tabs.onAttached.addListener((tabId) => {
    udpateLastActivatedAtOfTab(tabId);
  });
  chrome.tabs.onHighlighted.addListener((highlightInfo) => {
    const { tabIds } = highlightInfo;
    for (const tabId of tabIds) {
      udpateLastActivatedAtOfTab(tabId);
    }
  });
  chrome.tabs.onMoved.addListener((tabId) => {
    udpateLastActivatedAtOfTab(tabId);
  });
  chrome.tabs.onUpdated.addListener((tabId) => {
    udpateLastActivatedAtOfTab(tabId);
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
