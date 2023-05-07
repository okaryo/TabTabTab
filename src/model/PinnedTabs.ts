import { NestedTabs } from './NestedTabs'
import { Tab } from './Tab'
import { TabId } from './TabId'

export class PinnedTabs implements NestedTabs {
  constructor(
    private _values: Tab[],
  ) {}

  static empty(): PinnedTabs { return new PinnedTabs([]) }

  get length(): number { return this._values.length }

  get isEmpty(): boolean { return this.length === 0 }

  get values(): Tab[] { return this._values }

  add(tab: Tab): PinnedTabs {
    return new PinnedTabs([...this._values, tab])
  }

  findTabBy(tabId: TabId): Tab | null {
    const tab = this._values.find((value) => value.id.equalTo(tabId))
    return tab === undefined ? null : tab
  }

  updateTab(tab: Tab): PinnedTabs {
    const tabs = this._values.map((value) => {
      return value.id.equalTo(tab.id) ? tab : value
    })
    return new PinnedTabs(tabs)
  }

  removeTabBy(tabId: TabId): PinnedTabs {
    const tabs = this._values.filter((value) => !value.id.equalTo(tabId))
    return new PinnedTabs(tabs)
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }
}
