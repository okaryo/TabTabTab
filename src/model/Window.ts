import { GroupedColor } from "./GroupedColor";
import { GroupId } from "./GroupId";
import { Tab } from "./Tab";
import { TabId } from "./TabId";
import { Tabs } from "./Tabs";
import { WindowId } from "./WindowId";

export class Window {
  constructor(
    private _id: WindowId,
    private _tabs: Tabs,
    private _isFocused: boolean
  ) {}

  static initializeBy(windowId: WindowId, isFocused = false): Window {
    return new Window(windowId, Tabs.empty(), isFocused);
  }

  get id(): WindowId {
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
    groupId: GroupId,
    groupName: string,
    color: GroupedColor,
    tab: Tab
  ): Window {
    const newTabs = this._tabs.addGroupedTabBy(groupId, groupName, color, tab);
    return new Window(this._id, newTabs, this._isFocused);
  }

  findTabBy(tabId: TabId): Tab | null {
    return this._tabs.findTabBy(tabId);
  }

  updateTab(tab: Tab): Window {
    const newTabs = this._tabs.updateTab(tab);
    return new Window(this._id, newTabs, this._isFocused);
  }

  removeTabBy(tabId: TabId): Window {
    const newTabs = this._tabs.removeTabBy(tabId);
    return new Window(this._id, newTabs, this._isFocused);
  }
}
