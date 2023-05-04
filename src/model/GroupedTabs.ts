import { GroupedColor } from './GroupedColor'
import { GroupId } from './GroupId'
import { NestedTabs } from './NestedTabs'
import { Tab } from './Tab'
import { TabId } from './TabId'

export class GroupedTabs implements NestedTabs {
  constructor(
    private _id: GroupId,
    private _name: string,
    private _color: GroupedColor,
    private _values: Tab[],
  ) {}

  get id(): GroupId { return this._id }

  get name(): string { return this._name }

  get colorCode(): string { return this._color.code }

  get length(): number { return this._values.length }

  get isEmpty(): boolean { return this.length === 0 }

  add(tab: Tab): GroupedTabs {
    return new GroupedTabs(this._id, this._name, this._color, [...this._values, tab])
  }

  findTabBy(tabId: TabId): Tab | null {
    const tab = this._values.find((value) => value.id.equalTo(tabId))
    return tab === undefined ? null : tab
  }

  updateTab(tab: Tab): GroupedTabs {
    const tabs = this._values.map((value) => {
      return value.id.equalTo(tab.id) ? tab : value
    })
    return new GroupedTabs(this._id, this._name, this._color, tabs)
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }

  removeTabBy(tabId: TabId): GroupedTabs {
    const tabs = this._values.filter((value) => !value.id.equalTo(tabId))
    return new GroupedTabs(this._id, this._name, this._color, tabs)
  }
}
