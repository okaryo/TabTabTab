import { GroupColor } from "./GroupColor";
import { Tab } from "./Tab";

export type TabContainer = {
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

export const isPinned = (container: TabContainer): container is Pinned => {
  return (
    "children" in container && "id" in container && container.id === "pinned"
  );
};

export const isTabGroup = (container: TabContainer): container is TabGroup => {
  return (
    "children" in container &&
    "id" in container &&
    "name" in container &&
    "color" in container &&
    "collapsed" in container
  );
};
