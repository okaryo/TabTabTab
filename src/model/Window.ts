import { Tabs } from './Tabs'
import { WindowId } from './WindowId'

// NOTE: 'Tb' is a prefix to avoid class name conflict with other libraries.
export class TbWindow {
  constructor(
    private id: WindowId,
    private tabs: Tabs,
    private isFocused: boolean
  ) {}
}
