import { Tab } from "./Tab";

export interface NestedTabs {
  length: number;
  isEmpty: boolean;
  tabs: Tab[];
  add(tab: Tab): NestedTabs;
  findTabBy(tabId: number): Tab | null;
  updateTab(tab: Tab): NestedTabs;
  removeTabBy(tabId: number): NestedTabs;
  map<T>(callbak: (value: Tab) => T): T[];
}
