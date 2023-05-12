import { GroupedColor } from '../model/GroupedColor'
import { GroupId } from '../model/GroupId'
import { Tab } from '../model/Tab'
import { TabId } from '../model/TabId'
import { TbWindow } from '../model/Window'
import { WindowId } from '../model/WindowId'
import { TbWindows } from '../model/Windows'

type DateString = string
type StoredData = {
  last_activated_at: StoredLastActivatedAt
}
type StoredLastActivatedAt = {
  [tabId: string]: DateString
}

const LAST_ACTIVATED_AT_KEY = 'last_activated_at'

export const getWindows = async (): Promise<TbWindows> => {
  const currentWindow = await getCurrentWindow()
  const unfocusedWindows = await getUnfocusedWindows()
  const windows = new TbWindows([currentWindow, ...(unfocusedWindows.values)])
  return applyLastActivatedAtOfTabInWindows(windows)
}

const getCurrentWindow = async (): Promise<TbWindow> => {
  const currentWindowTabs = await chrome.tabs.query({ currentWindow: true })

  const windowId = new WindowId(currentWindowTabs[0].windowId)
  let currentWindow = TbWindow.initializeBy(windowId, true)
  for (const tab of currentWindowTabs) {
    const newTab = new Tab(
      new TabId(tab.id),
      tab.title,
      new URL(tab.url),
      tab.favIconUrl,
      tab.highlighted
    )

    if (tab.pinned) {
      currentWindow = currentWindow.addPinnedTab(newTab)
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = new GroupId(tab.groupId)
      const group = await chrome.tabGroups.get(groupId.value)
      const groupColor = new GroupedColor(group.color)
      currentWindow = currentWindow.addGroupedTab(groupId, group.title, groupColor, newTab)
    } else {
      currentWindow = currentWindow.addTab(newTab)
    }
  }
  return currentWindow
}

const getUnfocusedWindows = async (): Promise<TbWindows> => {
  const unfocusedWindowTabs = await chrome.tabs.query({ currentWindow: false })

  let windows = TbWindows.empty()
  for (const tab of unfocusedWindowTabs) {
    const windowId = new WindowId(tab.windowId)
    const newTab = new Tab(
      new TabId(tab.id),
      tab.title,
      new URL(tab.url),
      tab.favIconUrl,
      tab.highlighted
    )

    if (tab.pinned) {
      windows = windows.addPinnedTab(windowId, false, newTab)
    } else if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      const groupId = new GroupId(tab.groupId)
      const group = await chrome.tabGroups.get(groupId.value)
      const groupColor = new GroupedColor(group.color)
      windows = windows.addGroupedTab(windowId, false, newTab, groupId, group.title, groupColor)
    } else {
      windows = windows.addTab(windowId, false, newTab)
    }
  }
  return windows
}

const applyLastActivatedAtOfTabInWindows = async (tbWindows: TbWindows): Promise<TbWindows> => {
  let newWindows = tbWindows
  const { last_activated_at } = await chrome.storage.session.get(LAST_ACTIVATED_AT_KEY) as StoredData
  if (!last_activated_at || Object.keys(last_activated_at).length === 0) return tbWindows

  for (const [tabId, dateString] of Object.entries(last_activated_at)) {
    newWindows = newWindows.updateLastActivatedAtOfTabBy(new TabId(Number(tabId)), new Date(dateString))
  }
  return newWindows
}
