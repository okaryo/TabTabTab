import { GroupColor } from "./GroupColor";
import { Tab } from "./Tab";

export type TabContainerId = TabGroupId | PinnedId;
export type TabContainer = {
  id: TabContainerId;
  children: Tab[];
};

// PinnedId format is `pinned-${windowId}`.
type PinnedId = string;
export type Pinned = TabContainer & {
  id: PinnedId;
};

export type TabGroupId = number;
export type TabGroup = TabContainer & {
  id: TabGroupId;
  name: string;
  color: GroupColor;
  collapsed: boolean;
};

export const generatePinnedId = (windowId: number) => `pinned-${windowId}`;

export const isPinnedId = (value: string | number): value is PinnedId => {
  return typeof value === "string" && value.startsWith("pinned");
}

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
  return isTabContainer(value) && isPinnedId(value.id);
};

export const isTabGroup = (value: TabContainer | Tab): value is TabGroup => {
  return (
    isTabContainer(value) &&
    "name" in value &&
    "color" in value &&
    "collapsed" in value
  );
};
