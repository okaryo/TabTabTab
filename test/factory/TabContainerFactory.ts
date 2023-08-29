import { GroupColor } from "../../src/model/GroupColor";
import { Pinned, TabGroup } from "../../src/model/TabContainer";

export const mockPinned = (attrs: Partial<Pinned> = {}): Pinned => {
  return {
    id: "pinned",
    children: [],
    ...attrs,
  };
};

export const mockTabGroup = (attrs: Partial<TabGroup> = {}): TabGroup => {
  return {
    id: 1,
    name: "TabGroup",
    color: new GroupColor("red"),
    collapsed: false,
    children: [],
    ...attrs,
  };
};
