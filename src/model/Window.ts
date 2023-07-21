import { GroupedColor } from "./GroupedColor";
import { Tab } from "./Tab";
import { Tabs } from "./Tabs";

export class Window {
  constructor(
    private _id: number,
    private _tabs: Tabs,
    private _isFocused: boolean,
  ) {}

  static initializeBy(windowId: number, isFocused = false): Window {
    return new Window(windowId, Tabs.empty(), isFocused);
  }

  get id(): number {
    return this._id;
  }

  get tabs(): Tabs {
    return this._tabs;
  }

  get flatTabs(): Tab[] {
    return this._tabs.flatTabs;
  }

  get isFocused(): boolean {
    return this._isFocused;
  }

  get tabCount(): number {
    return this._tabs.totalTabCount;
  }

  addTab(tab: Tab): Window {
    return new Window(this._id, this._tabs.add(tab), this._isFocused);
  }

  addPinnedTab(tab: Tab): Window {
    const newTabs = this._tabs.addPinnedTab(tab);
    return new Window(this._id, newTabs, this._isFocused);
  }

  addGroupedTab(
    groupId: number,
    groupName: string,
    color: GroupedColor,
    collapsed: boolean,
    tab: Tab,
  ): Window {
    const newTabs = this._tabs.addGroupedTabBy(
      groupId,
      groupName,
      color,
      collapsed,
      tab,
    );
    return new Window(this._id, newTabs, this._isFocused);
  }

  findTabBy(tabId: number): Tab | null {
    return this._tabs.findTabBy(tabId);
  }

  updateTab(tab: Tab): Window {
    const newTabs = this._tabs.updateTab(tab);
    return new Window(this._id, newTabs, this._isFocused);
  }

  removeTabBy(tabId: number): Window {
    const newTabs = this._tabs.removeTabBy(tabId);
    return new Window(this._id, newTabs, this._isFocused);
  }
}
