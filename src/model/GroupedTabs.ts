import { GroupedColor } from "./GroupedColor";
import { GroupId } from "./GroupId";
import { NestedTabs } from "./NestedTabs";
import { Tab } from "./Tab";
import { TabId } from "./TabId";

export class GroupedTabs implements NestedTabs {
  constructor(
    public id: GroupId,
    public name: string,
    public color: GroupedColor,
    public collapsed: boolean,
    public values: Tab[],
  ) {}

  get colorCode(): string {
    return this.color.code;
  }

  get length(): number {
    return this.values.length;
  }

  get isEmpty(): boolean {
    return this.length === 0;
  }

  add(tab: Tab): GroupedTabs {
    return new GroupedTabs(this.id, this.name, this.color, this.collapsed, [
      ...this.values,
      tab,
    ]);
  }

  findTabBy(tabId: TabId): Tab | null {
    const tab = this.values.find((value) => value.id.equalTo(tabId));
    return tab === undefined ? null : tab;
  }

  updateTab(tab: Tab): GroupedTabs {
    const tabs = this.values.map((value) => {
      return value.id.equalTo(tab.id) ? tab : value;
    });
    return new GroupedTabs(
      this.id,
      this.name,
      this.color,
      this.collapsed,
      tabs,
    );
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this.values.map<T>((value) => callback(value));
  }

  removeTabBy(tabId: TabId): GroupedTabs {
    const tabs = this.values.filter((value) => !value.id.equalTo(tabId));
    return new GroupedTabs(
      this.id,
      this.name,
      this.color,
      this.collapsed,
      tabs,
    );
  }
}
