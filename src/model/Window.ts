import { GroupedColor } from './GroupedColor'
import { GroupId } from './GroupId'

import { Tab } from './Tab'
import { Tabs } from './Tabs'
import { WindowId } from './WindowId'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindow {
  constructor(
    private _id: WindowId,
    private _tabs: Tabs,
    private _isFocused: boolean
  ) {}

  static initializeBy(windowId: WindowId, isFocused = false): TbWindow {
    return new TbWindow(windowId, Tabs.empty(), isFocused)
  }

  get id(): WindowId { return this._id }

  get tabs(): Tabs {
    return this._tabs
  }

  get isFocused(): boolean { return this._isFocused }

  addTab(tab: Tab): TbWindow {
    return new TbWindow(this._id, this._tabs.add(tab), this._isFocused)
  }

  addPinnedTab(tab: Tab): TbWindow {
    const newTabs = this._tabs.addPinnedTab(tab)
    return new TbWindow(this._id, newTabs, this._isFocused)
  }

  addGroupedTab(groupId: GroupId, groupName: string, color: GroupedColor, tab: Tab): TbWindow {
    const newTabs = this._tabs.addGroupedTabBy(groupId, groupName, color, tab)
    console.log(newTabs)
    return new TbWindow(this._id, newTabs, this._isFocused)
  }
}
