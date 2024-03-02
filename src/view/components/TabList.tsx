import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import List from "@mui/material/List";
import { memo, useContext, useState } from "react";

import { Tab } from "../../model/Tab";
import { isPinned, isTabGroup } from "../../model/TabContainer";
import { WindowChild } from "../../model/Window";
import { WindowsContext } from "../contexts/WindowsContext";

import PinnedContainer from "./PinnedContainer";
import SortableItem from "./SortableItem";
import SortableTabs from "./SortableTabs";
import TabGroupContainer from "./TabGroupContainer";
import TabItem from "./TabItem";

type TabListProps = {
  selectedWindowIndex: number;
};

const TabList = memo((props: TabListProps) => {
  const { selectedWindowIndex } = props;
  const { windows } = useContext(WindowsContext);
  const window = windows[selectedWindowIndex];
  const [pinnedCollapsed, setPinnedCollapsed] = useState(true);

  const convertToElement = (child: WindowChild) => {
    if (isPinned(child)) {
      return (
        <PinnedContainer
          pinned={child}
          collapsed={pinnedCollapsed}
          toggleCollapsed={() => setPinnedCollapsed(!pinnedCollapsed)}
          data={{ type: "pinned", parentType: "window", windowId: window.id }}
        >
          <SortableTabs
            id={child.id}
            parentType="pinned"
            windowId={window.id}
            tabs={child.children}
          />
        </PinnedContainer>
      );
    }
    if (isTabGroup(child)) {
      return (
        <SortableItem
          key={child.id}
          id={child.id.toString()}
          data={{ type: "tabGroup", parentType: "window", windowId: window.id }}
        >
          <TabGroupContainer tabGroup={child}>
            <SortableTabs
              id={child.id.toString()}
              parentType="tabGroup"
              windowId={window.id}
              tabs={child.children}
            />
          </TabGroupContainer>
        </SortableItem>
      );
    }

    const tab = child as Tab;
    return (
      <SortableItem
        key={tab.id}
        id={tab.id.toString()}
        data={{ type: "tab", parentType: "window", windowId: window.id }}
      >
        <TabItem tab={tab} cursorGrabbing />
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
});

export default TabList;
