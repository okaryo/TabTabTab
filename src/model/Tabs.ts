import { GroupedColor } from './GroupedColor'
import { GroupedTabs } from './GroupedTabs'
import { GroupId } from './GroupId'
import { PinnedTabs } from './PinnedTabs'
import { Tab } from './Tab'
import { TabId } from './TabId'

type Tabable = Tab | PinnedTabs | GroupedTabs

export class Tabs {
  constructor(
    private _values: Tabable[],
  ) {}

  static empty(): Tabs { return new Tabs([]) }

  get values(): Tabable[] {
    return this._values
  }

  get pinnedTabs(): PinnedTabs {
    const pinnedTabs = this.findPinnedTabs()
    return pinnedTabs === null ? PinnedTabs.empty() : pinnedTabs
  }

  get totalTabCount(): number {
    return this._values.reduce((total, value) => {
      if (value instanceof GroupedTabs) return total + value.length
      if (value instanceof PinnedTabs) return total + value.length
      return total + 1
    }, 0)
  }

  add(value: Tabable): Tabs {
    return new Tabs([...this._values, value])
  }

  map<T>(callback: (value: Tabable) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }

  addGroupedTabBy(groupId: GroupId, groupName: string, color: GroupedColor, tab: Tab): Tabs {
    const groupedTabs = this.findGroupedTabsBy(groupId)
    if (groupedTabs === null) {
      const newTabable = new GroupedTabs(groupId, groupName, color, [tab])
      return this.add(newTabable)
    }

    const newTabs = this._values.map((value) => {
      return (value instanceof GroupedTabs && groupedTabs.id === value.id) ? groupedTabs.add(tab) : value
    })
    return new Tabs(newTabs)
  }

  addPinnedTab(tab: Tab): Tabs {
    const pinnedTabs = this.findPinnedTabs()
    if (pinnedTabs === null) {
      const newTabable = new PinnedTabs([tab])
      return this.add(newTabable)
    }

    const newTabs = this._values.map((value) => {
      return value instanceof PinnedTabs ? value.add(tab) : value
    })
    return new Tabs(newTabs)
  }

  removeTabBy(tabId: TabId): Tabs {
    const tab = this.findNormalTabBy(tabId)
    let tabs: Tabable[]
    if (tab === null) {
      tabs = this._values.map((value) => {
        if (value instanceof GroupedTabs) return value.removeTabBy(tabId)
        if (value instanceof PinnedTabs) return value.removeTabBy(tabId)
        return value
      })
    } else {
      tabs = this._values.filter((value) => {
        if (value instanceof Tab) return !value.id.equalTo(tabId)
        return true
      })
    }
    return new Tabs(tabs)
  }

  private findNormalTabBy(tabId: TabId): Tab | null {
    const tab = this._values.find((value) => {
      if (value instanceof Tab) return value.id.equalTo(tabId)
      return false
    }) as (Tab | undefined)
    return tab === undefined ? null : tab
  }

  private findGroupedTabsBy(groupId: GroupId): GroupedTabs | null {
    const groupedTabsList = this._values.filter((value) => value instanceof GroupedTabs) as GroupedTabs[]
    const groupedTabs = groupedTabsList.find((tabs) => tabs.id.equalTo(groupId))
    return groupedTabs === undefined ? null : groupedTabs
  }

  private findPinnedTabs(): PinnedTabs | null {
    const pinnedTabs = this._values.find((value) => value instanceof PinnedTabs) as (PinnedTabs | undefined)
    return pinnedTabs === undefined ? null : pinnedTabs
  }
}
