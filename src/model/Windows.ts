import { GroupedColor } from './GroupedColor'
import { GroupId } from './GroupId'
import { Tab } from './Tab'
import { TabId } from './TabId'
import { Tabs } from './Tabs'
import { TbWindow } from './Window'
import { WindowId } from './WindowId'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindows {
  constructor(
    private _values: TbWindow[]
  ) {}

  static empty(): TbWindows { return new TbWindows([]) }

  get length(): number { return this._values.length }

  get values(): TbWindow[] { return this._values }

  get unforcusedWindowCount(): number {
    return this.unfocusedWindows.length
  }

  get focusedWindowTabs(): Tabs {
    const focusedWindow = this._values.find((value) => value.isFocused)
    return focusedWindow === undefined ? Tabs.empty() : focusedWindow.tabs
  }

  get currentWindow(): TbWindow {
    return this._values.find((value) => value.isFocused)
  }

  get unfocusedWindows(): TbWindows {
    const unfocusedWindows = this._values.filter((value) => !value.isFocused)
    return new TbWindows(unfocusedWindows)
  }

  add(window: TbWindow): TbWindows {
    return new TbWindows([...this._values, window])
  }

  map<T>(callback: (value: TbWindow, index: number) => T): T[] {
    return this._values.map<T>((value, index) => callback(value, index))
  }

  addTab(windowId: WindowId, isFocused: boolean, tab: Tab): TbWindows {
    const window = this.findWindowBy(windowId)
    if (window === null) {
      const newWindow = new TbWindow(windowId, new Tabs([tab]), isFocused)
      return this.add(newWindow)
    }

    const newWindow = window.addTab(tab)
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window
    })
    return new TbWindows(newWindows)
  }

  addGroupedTab(windowId: WindowId, isFocused: boolean, tab: Tab, groupId: GroupId, groupName: string, color: GroupedColor): TbWindows {
    const window = this.findWindowBy(windowId)
    if (window === null) {
      const newWindow = new TbWindow(windowId, new Tabs([tab]), isFocused)
      return this.add(newWindow)
    }

    const newWindow = window.addGroupedTab(groupId, groupName, color, tab)
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window
    })
    return new TbWindows(newWindows)
  }

  addPinnedTab(windowId: WindowId, isFocused: boolean, tab: Tab): TbWindows {
    const window = this.findWindowBy(windowId)
    if (window === null) {
      const newWindow = new TbWindow(windowId, new Tabs([tab]), isFocused)
      return this.add(newWindow)
    }

    const newWindow = window.addPinnedTab(tab)
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window
    })
    return new TbWindows(newWindows)
  }

  removeTabBy(tabId: TabId): TbWindows {
    const newWindows = this._values.map((value) => value.removeTabBy(tabId))
    return new TbWindows(newWindows)
  }

  private findWindowBy(windowId: WindowId): TbWindow | null {
    const window = this._values.find((value) => windowId.equalTo(value.id))
    return window === undefined ? null : window
  }
}
