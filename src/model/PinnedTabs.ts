import { NestedTabs } from "./NestedTabs";
import { Tab } from "./Tab";

export class PinnedTabs implements NestedTabs {
  constructor(public tabs: Tab[]) {}

  static empty(): PinnedTabs {
    return new PinnedTabs([]);
  }

  get length(): number {
    return this.tabs.length;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  add(tab: Tab): PinnedTabs {
    return new PinnedTabs([...this.tabs, tab]);
  }

  findTabBy(tabId: number): Tab | null {
    const tab = this.tabs.find((value) => value.id === tabId);
    return tab === undefined ? null : tab;
  }

  updateTab(tab: Tab): PinnedTabs {
    const tabs = this.tabs.map((value) => {
      return value.id === tab.id ? tab : value;
    });
    return new PinnedTabs(tabs);
  }

  removeTabBy(tabId: number): PinnedTabs {
    const tabs = this.tabs.filter((value) => value.id !== tabId);
    return new PinnedTabs(tabs);
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this.tabs.map<T>((value) => callback(value));
  }
}
