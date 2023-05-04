import { TabId } from './model/TabId'
import DeleteLastActivatedAtOfTabUseCase from './usecase/DeleteLastActivatedAtOfTabUseCase'
import UdpateLastActivatedAtOfTabUseCase from './usecase/UdpateLastActivatedAtOfTabUseCase'

const addListenerOnTabFocused = () => {
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const { tabId } = activeInfo
    await UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onAttached.addListener(async (tabId) => {
    await UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onHighlighted.addListener(async (highlightInfo) => {
    const { tabIds } = highlightInfo
    console.log(tabIds)
    for (const tabId of tabIds) {
      await UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
    }
  })
  chrome.tabs.onMoved.addListener(async (tabId) => {
    await UdpateLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
}

const addListenerOnTabClosed = () => {
  chrome.tabs.onDetached.addListener(async (tabId) => {
    await DeleteLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
  chrome.tabs.onRemoved.addListener(async (tabId) => {
    await DeleteLastActivatedAtOfTabUseCase(new TabId(tabId))
  })
}

addListenerOnTabFocused()
addListenerOnTabClosed()
