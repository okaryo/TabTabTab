import type { Pinned, TabGroup } from "../../src/model/TabContainer";

export const mockPinned = (attrs: Partial<Pinned> = {}): Pinned => {
  return {
    id: "pinned-100",
    children: [],
    ...attrs,
  };
};

export const mockTabGroup = (attrs: Partial<TabGroup> = {}): TabGroup => {
  return {
    id: 1,
    name: "TabGroup",
    color: "red",
    collapsed: false,
    children: [],
    ...attrs,
  };
};
