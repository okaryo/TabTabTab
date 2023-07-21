import { GroupColor } from "./GroupColor";
import { NestedTabs } from "./NestedTabs";
import { Tab } from "./Tab";

export class TabGroup implements NestedTabs {
  constructor(
    public id: number,
    public name: string,
    public color: GroupColor,
    public collapsed: boolean,
    public tabs: Tab[],
  ) {}

  get colorCode(): string {
    return this.color.code;
  }

  get length(): number {
    return this.tabs.length;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  add(tab: Tab): TabGroup {
    return new TabGroup(this.id, this.name, this.color, this.collapsed, [
      ...this.tabs,
      tab,
    ]);
  }

  findTabBy(tabId: number): Tab | null {
    const tab = this.tabs.find((value) => value.id === tabId);
    return tab === undefined ? null : tab;
  }

  updateTab(tab: Tab): TabGroup {
    const tabs = this.tabs.map((value) => {
      return value.id === tab.id ? tab : value;
    });
    return new TabGroup(this.id, this.name, this.color, this.collapsed, tabs);
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this.tabs.map<T>((value) => callback(value));
  }

  removeTabBy(tabId: number): TabGroup {
    const tabs = this.tabs.filter((value) => value.id !== tabId);
    return new TabGroup(this.id, this.name, this.color, this.collapsed, tabs);
  }
}
