import { GroupedColor } from '../model/GroupedColor'
import { GroupId } from '../model/GroupId'
import { Tab } from '../model/Tab'
import { TabId } from '../model/TabId'
import { TbWindow } from '../model/Window'
import { WindowId } from '../model/WindowId'
import { TbWindows } from '../model/Windows'

export class ChromeTabsAPI {
  static async getCurrentWindow(): Promise<TbWindow> {
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

  static async getUnfocusedWindows(): Promise<TbWindows> {
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

  static async focusTab(tabId: TabId) {
    const tab = await chrome.tabs.get(tabId.value)
    const windowId = tab.windowId

    /* eslint @typescript-eslint/no-floating-promises: 0 */
    chrome.windows.update(windowId, { focused: true })
    chrome.tabs.update(tabId.value, { active: true })
  }

  static async removeTab(tabId: TabId) {
    await chrome.tabs.remove(tabId.value)
  }
}
