import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Tab } from "../../../../model/Tab";

import SortableItem from "./SortableItem";
import TabItem from "./TabItem";

type SortableTabsProps = {
  id: string;
  parentType: "tabGroup" | "pinned";
  tabs: Tab[];
};

const SortableTabs = (props: SortableTabsProps) => {
  const { id, parentType, tabs } = props;

  return (
    <SortableContext
      id={id}
      items={tabs.map((tab) => tab.id.toString())}
      strategy={verticalListSortingStrategy}
    >
      {tabs.map((tab) => (
        <SortableItem
          key={tab.id}
          id={tab.id.toString()}
          data={{ type: "tab", parentType: parentType, windowId: tab.windowId }}
        >
          <TabItem tab={tab} />
        </SortableItem>
      ))}
    </SortableContext>
  );
};

export default SortableTabs;
