import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import List from "@mui/material/List";
import { useContext } from "react";

import { Tab } from "../../../../model/Tab";
import { isPinned, isTabGroup } from "../../../../model/TabContainer";
import { WindowChild } from "../../../../model/Window";
import { WindowsContext } from "../contexts/Windows";

import PinnedContainer from "./PinnedContainer";
import SortableItem from "./SortableItem";
import SortableTabs from "./SortableTabs";
import TabGroupContainer from "./TabGroupContainer";
import TabItem from "./TabItem";

type TabListProps = {
  selectedWindowIndex: number;
  pinnedCollapsed: boolean;
  setPinnedCollapsed: (collapsed: boolean) => void;
};

const TabList = (props: TabListProps) => {
  const { selectedWindowIndex, pinnedCollapsed, setPinnedCollapsed } = props;
  const { windows } = useContext(WindowsContext);
  const window = windows[selectedWindowIndex];

  const convertToElement = (child: WindowChild) => {
    if (isPinned(child)) {
      return (
        <PinnedContainer
          pinned={child}
          collapsed={pinnedCollapsed}
          toggleCollapsed={() => setPinnedCollapsed(!pinnedCollapsed)}
        >
          <SortableTabs id={child.id} tabs={child.children} />
        </PinnedContainer>
      );
    }
    if (isTabGroup(child)) {
      return (
        <SortableItem key={child.id} id={child.id.toString()}>
          <TabGroupContainer tabGroup={child}>
            <SortableTabs id={child.id.toString()} tabs={child.children} />
          </TabGroupContainer>
        </SortableItem>
      );
    }

    const tab = child as Tab;
    return (
      <SortableItem key={tab.id} id={tab.id.toString()}>
        <TabItem tab={tab} />
      </SortableItem>
    );
  };

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
      {window && (
        <SortableContext
          id={window.id.toString()}
          items={window.children.map((child) => child.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {window.children.map((child) => convertToElement(child))}
        </SortableContext>
      )}
    </List>
  );
};

export default TabList;
