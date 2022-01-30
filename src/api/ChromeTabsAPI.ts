import { GroupedColor } from '../model/GroupedColor'
import { GroupId } from '../model/GroupId'
import { Tab } from '../model/Tab'
import { TabId } from '../model/TabId'

import { TbWindow } from '../model/Window'
import { WindowId } from '../model/WindowId'


export class ChromeTabsAPI {
  static async getCurrentWindow(): Promise<TbWindow> {
    const currentWindowTabs = await chrome.tabs.query({ currentWindow: true })

    const windowId = new WindowId(currentWindowTabs[0].windowId)
    let currentWindow = TbWindow.initializeBy(windowId, true)
    for (const tab of currentWindowTabs) {
      const newTab = new Tab(
        new TabId(tab.id),
        tab.title,
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
}
