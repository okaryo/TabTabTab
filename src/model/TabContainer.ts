import { GroupColor } from "./GroupColor";
import { Tab } from "./Tab";

export type TabContainerId = number | "pinned";
export type TabContainer = {
  id: TabContainerId;
  children: Tab[];
};
export type Pinned = TabContainer & {
  id: "pinned";
};
export type TabGroup = TabContainer & {
  id: number;
  name: string;
  color: GroupColor;
  collapsed: boolean;
};

export const isTab = (value: TabContainer | Tab): value is Tab => {
  return (
    "id" in value &&
    "title" in value &&
    "url" in value &&
    !("children" in value)
  );
};

export const isTabContainer = (
  value: TabContainer | Tab,
): value is TabContainer => {
  return "id" in value && "children" in value;
};

export const isPinned = (value: TabContainer | Tab): value is Pinned => {
  return isTabContainer(value) && value.id === "pinned";
};

export const isTabGroup = (value: TabContainer | Tab): value is TabGroup => {
  return (
    isTabContainer(value) &&
    "name" in value &&
    "color" in value &&
    "collapsed" in value
  );
};
