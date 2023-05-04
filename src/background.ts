import { TabId } from "./model/TabId"
import DeleteLastActivatedAtOfTabUseCase from "./usecase/DeleteLastActivatedAtOfTabUseCase"
import UdpateLastActivatedAtOfTabUseCase from "./usecase/UdpateLastActivatedAtOfTabUseCase"

const addListenerOnTabFocused = () => {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const { tabId } = activeInfo
    UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onAttached.addListener((tabId) => {
    UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onHighlighted.addListener((highlightInfo) => {
    const { tabIds } = highlightInfo
    console.log(tabIds)
    for (const tabId of tabIds) {
      UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
    }
  })
  chrome.tabs.onMoved.addListener((tabId) => {
    UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
}

const addListenerOnTabClosed = () => {
  chrome.tabs.onDetached.addListener((tabId) => {
    DeleteLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onRemoved.addListener((tabId) => {
    DeleteLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
}

addListenerOnTabFocused()
addListenerOnTabClosed()