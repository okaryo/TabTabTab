
import { Tabs } from './Tabs'
import { TbWindow } from './Window'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindows {
  constructor(
    private _values: TbWindow[]
  ) {}

  static empty(): TbWindows { return new TbWindows([]) }

  get unforcusedWindowCount(): number {
    return this._values.length - 1
  }

  get focusedWindowTabs(): Tabs {
    const focusedWindow = this._values.find((value) => value.isFocused)
    return focusedWindow === undefined ? Tabs.empty() : focusedWindow.tabs
  }
}
