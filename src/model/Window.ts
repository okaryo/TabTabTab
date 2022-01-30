import { Tabs } from './Tabs'
import { WindowId } from './WindowId'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindow {
  constructor(
    private _id: WindowId,
    private _tabs: Tabs,
    private _isFocused: boolean
  ) {}

  get tabs(): Tabs {
    return this._tabs
  }
}
