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

  add(tab: Tab): PinnedTabs {
    return new PinnedTabs([...this._values, tab])
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }

  removeTabBy(tabId: TabId): PinnedTabs {
    const tabs = this._values.filter((value) => !value.id.equalTo(tabId))
    return new PinnedTabs(tabs)
  }
}
