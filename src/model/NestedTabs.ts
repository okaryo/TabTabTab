import { Tab } from './Tab'
import { TabId } from './TabId'

export interface NestedTabs {
  length: number
  isEmpty: boolean
  add(tab: Tab): NestedTabs
  removeTabBy(tabId: TabId): NestedTabs
  map<T>(callbak: (value: Tab) => T): T[]
}
