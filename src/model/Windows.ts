import { GroupedColor } from "./GroupedColor";
import { GroupedTabs } from "./GroupedTabs";
import { GroupId } from "./GroupId";
import { PinnedTabs } from "./PinnedTabs";
import { Tab, updateLastActivatedAt } from "./Tab";
import { TabId } from "./TabId";
import { Tabs } from "./Tabs";
import { Window } from "./Window";
import { WindowId } from "./WindowId";

export class Windows {
  constructor(private _values: Window[]) {}

  static empty(): Windows {
    return new Windows([]);
  }

  get length(): number {
    return this._values.length;
  }

  get values(): Window[] {
    return this._values;
  }

  get unforcusedWindowCount(): number {
    return this.unfocusedWindows.length;
  }

  get focusedWindowTabs(): Tabs {
    const focusedWindow = this._values.find((value) => value.isFocused);
    return focusedWindow === undefined ? Tabs.empty() : focusedWindow.tabs;
  }

  get currentWindow(): Window {
    return this._values.find((value) => value.isFocused);
  }

  get unfocusedWindows(): Windows {
    const unfocusedWindows = this._values.filter((value) => !value.isFocused);
    return new Windows(unfocusedWindows);
  }

  get allTabs(): Tab[] {
    const tabsByWindow = this._values.map((value) => value.tabs);
    return tabsByWindow.map((tabs) => tabs.flatTabs).flat();
  }

  add(window: Window): Windows {
    return new Windows([...this._values, window]);
  }

  map<T>(callback: (value: Window, index: number) => T): T[] {
    return this._values.map<T>((value, index) => callback(value, index));
  }

  addTab(windowId: WindowId, isFocused: boolean, tab: Tab): Windows {
    const window = this.findWindowBy(windowId);
    if (window === null) {
      const newWindow = new Window(windowId, new Tabs([tab]), isFocused);
      return this.add(newWindow);
    }

    const newWindow = window.addTab(tab);
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window;
    });
    return new Windows(newWindows);
  }

  addGroupedTab(
    windowId: WindowId,
    isFocused: boolean,
    tab: Tab,
    groupId: GroupId,
    groupName: string,
    collapsed: boolean,
    color: GroupedColor,
  ): Windows {
    const window = this.findWindowBy(windowId);
    if (window === null) {
      const groupedTabs = new GroupedTabs(groupId, groupName, color, collapsed, [tab]);
      const newWindow = new Window(
        windowId,
        new Tabs([groupedTabs]),
        isFocused,
      );
      return this.add(newWindow);
    }

    const newWindow = window.addGroupedTab(groupId, groupName, color, collapsed, tab);
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window;
    });
    return new Windows(newWindows);
  }

  addPinnedTab(windowId: WindowId, isFocused: boolean, tab: Tab): Windows {
    const window = this.findWindowBy(windowId);
    if (window === null) {
      const pinnedTabs = new PinnedTabs([tab]);
      const newWindow = new Window(windowId, new Tabs([pinnedTabs]), isFocused);
      return this.add(newWindow);
    }

    const newWindow = window.addPinnedTab(tab);
    const newWindows = this.map((window) => {
      return window.id.equalTo(newWindow.id) ? newWindow : window;
    });
    return new Windows(newWindows);
  }

  updateLastActivatedAtOfTabBy(tabId: TabId, lastActivatedAt: Date): Windows {
    let tab: Tab = null;
    for (const window of this._values) {
      tab = window.findTabBy(tabId);
      if (tab !== null) break;
    }
    if (tab === null) return this;

    const newWindows = this._values.map((value) =>
      value.updateTab(updateLastActivatedAt(tab, lastActivatedAt)),
    );
    return new Windows(newWindows);
  }

  removeTabBy(tabId: TabId): Windows {
    const newWindows = this._values.map((value) => value.removeTabBy(tabId));
    return new Windows(newWindows);
  }

  pinTab(tab: Tab): Windows {
    const targetWindow = this.findWindowBy(tab.windowId);
    const newWindows = this.removeTabBy(tab.id);
    return newWindows.addPinnedTab(
      targetWindow.id,
      targetWindow.isFocused,
      tab,
    );
  }

  findTabsByTitleOrUrl(value: string): Tab[] {
    value = value.toLowerCase();
    return this.allTabs.filter((tab) => {
      return (
        tab.title.toLowerCase().includes(value) ||
        tab.url.href.toLowerCase().includes(value)
      );
    });
  }

  private findWindowBy(windowId: WindowId): Window | null {
    const window = this._values.find((value) => windowId.equalTo(value.id));
    return window === undefined ? null : window;
  }
}
