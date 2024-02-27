import { GroupColor } from "./GroupColor";
import { StoredTab, Tab } from "./Tab";
import { WindowId } from "./Window";

export type TabContainerId = TabGroupId | PinnedId;
export type TabContainer = {
  id: TabContainerId;
  children: Tab[];
};
export type StoredTabContainer = {
  type: "pinned" | "tabGroup";
  internalUid: string;
  children: StoredTab[];
};
export type StoredPinned = StoredTabContainer & {
  type: "pinned";
};
export type StoredTabGroup = StoredTabContainer &
  Pick<TabGroup, "name" | "color"> & {
    type: "tabGroup";
    storedAt: Date;
  };
export type StoredTabGroupInWindow = Omit<StoredTabGroup, "storedAt">;

// NOTE: PinnedId format is `pinned-${windowId}`.
type PinnedId = `pinned-${WindowId}`;
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

export const generatePinnedId = (windowId: number): `pinned-${number}` =>
  `pinned-${windowId}`;

export const isPinnedId = (value: string | number): value is PinnedId => {
  return typeof value === "string" && value.startsWith("pinned");
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

export const isStoredTabGroup = (
  container: StoredTabContainer,
): container is StoredTabGroup => {
  return container.type === "tabGroup";
};
