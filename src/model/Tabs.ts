import { GroupedColor } from "./GroupedColor";
import { GroupedTabs } from "./GroupedTabs";
import { NestedTabs } from "./NestedTabs";
import { PinnedTabs } from "./PinnedTabs";
import { Tab } from "./Tab";

type Tabable = Tab | NestedTabs;

export class Tabs {
  constructor(private _values: Tabable[]) {}

  static empty(): Tabs {
    return new Tabs([]);
  }

  get values(): Tabable[] {
    return this._values;
  }

  get pinnedTabs(): PinnedTabs {
    const pinnedTabs = this.findPinnedTabs();
    return pinnedTabs === null ? PinnedTabs.empty() : pinnedTabs;
  }

  get totalTabCount(): number {
    return this._values.reduce((total, value) => {
      if (this.isNestedTabs(value)) return total + value.length;
      return total + 1;
    }, 0);
  }

  get flatTabs(): Tab[] {
    return this._values
      .map((value) => {
        if (this.isNestedTabs(value)) return value.values;
        return value;
      })
      .flat();
  }

  add(value: Tabable): Tabs {
    return new Tabs([...this._values, value]);
  }

  map<T>(callback: (value: Tabable) => T): T[] {
    return this._values.map<T>((value) => callback(value));
  }

  addGroupedTabBy(
    groupId: number,
    groupName: string,
    color: GroupedColor,
    collapsed: boolean,
    tab: Tab,
  ): Tabs {
    const groupedTabs = this.findGroupedTabsBy(groupId);
    if (groupedTabs === null) {
      const newTabable = new GroupedTabs(groupId, groupName, color, collapsed, [
        tab,
      ]);
      return this.add(newTabable);
    }

    const newTabs = this._values.map((value) => {
      return value instanceof GroupedTabs && groupedTabs.id === value.id
        ? groupedTabs.add(tab)
        : value;
    });
    return new Tabs(newTabs);
  }

  addPinnedTab(tab: Tab): Tabs {
    const pinnedTabs = this.findPinnedTabs();
    if (pinnedTabs === null) {
      const newTabable = new PinnedTabs([tab]);
      return this.add(newTabable);
    }

    const newTabs = this._values.map((value) => {
      return value instanceof PinnedTabs ? value.add(tab) : value;
    });
    return new Tabs(newTabs);
  }

  findTabBy(tabId: number): Tab | null {
    for (const value of this._values) {
      if (this.isTab(value)) {
        if (value.id === tabId) {
          return value;
        }
      } else {
        const tab = value.findTabBy(tabId);
        if (tab !== null) return tab;
      }
    }

    return null;
  }

  updateTab(tab: Tab): Tabs {
    const tabs = this._values.map((value) => {
      if (this.isTab(value)) return value.id === tab.id ? tab : value;
      return value.updateTab(tab);
    });
    return new Tabs(tabs);
  }

  removeTabBy(tabId: number): Tabs {
    const tab = this.findNormalTabBy(tabId);
    let tabs: Tabable[];
    if (tab === null) {
      tabs = this._values.map((value) => {
        if (this.isNestedTabs(value)) return value.removeTabBy(tabId);
        return value;
      });
    } else {
      tabs = this._values.filter((value) => {
        if (this.isTab(value)) return value.id !== tabId;
        return true;
      });
    }
    return new Tabs(this.removeEmtpyNestedTab(tabs));
  }

  private findNormalTabBy(tabId: number): Tab | null {
    const tab = this._values.find((value) => {
      if (this.isTab(value)) return value.id === tabId;
      return false;
    }) as Tab | undefined;
    return tab === undefined ? null : tab;
  }

  private findGroupedTabsBy(groupId: number): GroupedTabs | null {
    const groupedTabsList = this._values.filter(
      (value) => value instanceof GroupedTabs,
    ) as GroupedTabs[];
    const groupedTabs = groupedTabsList.find(
      (tabGroup) => tabGroup.id === groupId,
    );
    return groupedTabs === undefined ? null : groupedTabs;
  }

  private findPinnedTabs(): PinnedTabs | null {
    const pinnedTabs = this._values.find(
      (value) => value instanceof PinnedTabs,
    ) as PinnedTabs | undefined;
    return pinnedTabs === undefined ? null : pinnedTabs;
  }

  private removeEmtpyNestedTab(tabs: Tabable[]): Tabable[] {
    return tabs.filter((value) => !this.isNestedTabs(value) || !value.isEmpty);
  }

  private isNestedTabs(value: Tabable): value is NestedTabs {
    return value instanceof GroupedTabs || value instanceof PinnedTabs;
  }

  private isTab(value: Tabable): value is Tab {
    return !this.isNestedTabs(value);
  }
}
