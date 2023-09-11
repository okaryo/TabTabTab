import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Tab } from "../../../../model/Tab";

import TabItem from "./TabItem";
import { SortableItem } from "./TabList";

type SortableTabsProps = {
  id: string;
  tabs: Tab[];
};

const SortableTabs = (props: SortableTabsProps) => {
  const { id, tabs } = props;

  return (
    <SortableContext
      id={id}
      items={tabs.map((tab) => tab.id.toString())}
      strategy={verticalListSortingStrategy}
    >
      {tabs.map((tab) => (
        <SortableItem key={tab.id} id={tab.id.toString()}>
          <TabItem tab={tab} />
        </SortableItem>
      ))}
    </SortableContext>
  );
};

export default SortableTabs;
