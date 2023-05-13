/* eslint @typescript-eslint/no-floating-promises: 0 */
import { TabId } from '../model/TabId'
import { deleteLastActivatedAtOfTab, udpateLastActivatedAtOfTab } from '../repository/TabsRepository'

export const addListenerOnTabActivated = () => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo
    udpateLastActivatedAtOfTab(new TabId(tabId))
  })
  chrome.tabs.onAttached.addListener((tabId) => {
    udpateLastActivatedAtOfTab(new TabId(tabId))
  })
  chrome.tabs.onHighlighted.addListener((highlightInfo) => {
    const { tabIds } = highlightInfo
    for (const tabId of tabIds) {
      udpateLastActivatedAtOfTab(new TabId(tabId))
    }
  })
  chrome.tabs.onMoved.addListener((tabId) => {
    udpateLastActivatedAtOfTab(new TabId(tabId))
  })
  chrome.tabs.onUpdated.addListener((tabId) => {
    udpateLastActivatedAtOfTab(new TabId(tabId))
  })
}

export const addListenerOnTabClosed = () => {
  chrome.tabs.onDetached.addListener((tabId) => {
    deleteLastActivatedAtOfTab(new TabId(tabId))
  })
  chrome.tabs.onRemoved.addListener((tabId) => {
    deleteLastActivatedAtOfTab(new TabId(tabId))
  })
}
