import { Tab } from './Tab'
import { TabId } from './TabId'

export interface NestedTabs {
  length: number
  isEmpty: boolean
  values: Tab[]
  add(tab: Tab): NestedTabs
  findTabBy(tabId: TabId): Tab | null
  updateTab(tab: Tab): NestedTabs
  removeTabBy(tabId: TabId): NestedTabs
  map<T>(callbak: (value: Tab) => T): T[]
}
