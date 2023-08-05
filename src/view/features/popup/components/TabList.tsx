/* eslint @typescript-eslint/no-floating-promises: 0 */

import {
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableData,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@mui/material/List";
import { useContext, useEffect, useMemo, useState } from "react";

import { PinnedTabs } from "../../../../model/PinnedTabs";
import { Tab } from "../../../../model/Tab";
import { TabGroup } from "../../../../model/TabGroup";
import { Tabs } from "../../../../model/Tabs";
import { WindowsContext } from "../contexts/Windows";
import { useAddTabToTabGroup } from "../hooks/useAddTabToTabGroup";
import { useMoveTab } from "../hooks/useMoveTab";
import { useMoveTabGroup } from "../hooks/useMoveTabGroup";
import { usePinTab } from "../hooks/usePinTab";
import { useMoveTabOutOfGroup } from "../hooks/useTabOutOfTabGroup";

import GroupedTabList from "./GroupedTabList";
import PinnedTabList from "./PinnedTabList";
import TabItem from "./TabItem";

type ContainerNodeType = "root" | "pinned" | "tabGroup";
// type DroppableNodeType = "root" | "tabGroup";
type NodeType = ContainerNodeType | "tab";
type Node<T extends NodeType> = {
  id: string;
  type: T;
};
type TabNode = Node<"tab"> & {
  tab: Tab;
};
type ContainerNode<
  T extends ContainerNodeType,
  U extends ChildNode,
> = Node<T> & {
  nodes: U[];
};
type PinnedNode = ContainerNode<"pinned", TabNode>;
type TabGroupNode = ContainerNode<"tabGroup", TabNode> & {
  tabGroup: TabGroup;
};
type ChildNode = PinnedNode | TabGroupNode | TabNode;
type RootNode = ContainerNode<"root", ChildNode>;

type TabListProps = {
  selectedWindowIndex: number;
};
type SortableItemProps = {
  id: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const SortableItem = (props: SortableItemProps) => {
  const { id, style, children } = props;

  const { active, attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        visibility: active?.id === id ? "hidden" : "visible",
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {children}
    </div>
  );
};

export const findNodeById = (
  id: string,
  nodes: Node<NodeType>[],
): { node: Node<NodeType>; indexInAll: number } | null => {
  let indexInAll = 0;
  for (const node of nodes) {
    if (node.id === id) {
      return { node, indexInAll };
    }
    if (isContainerNode(node)) {
      for (const childNode of node.nodes) {
        if (childNode.id === id) {
          return { node: childNode, indexInAll };
        }
        indexInAll++;
      }
    }

    if (!isContainerNode(node)) indexInAll++;
  }

  return null;
};

export const isContainerNode = (
  node: Node<NodeType>,
): node is ContainerNode<ContainerNodeType, ChildNode> => {
  return ["root", "pinned", "tabGroup"].includes(node.type);
};

const TabList = (props: TabListProps) => {
  const { selectedWindowIndex } = props;
  const { windows } = useContext(WindowsContext);

  let tabs = Tabs.empty();
  if (selectedWindowIndex === 0) {
    tabs = windows.focusedWindowTabs;
  } else {
    tabs = windows.unfocusedWindows.values[selectedWindowIndex - 1].tabs;
  }

  const [activeId, setActiveId] = useState<string>(null);

  const nodesFromTabs = (tabs: Tabs): ChildNode[] => {
    return tabs.map<ChildNode>((tabable) => {
      if (tabable instanceof PinnedTabs) {
        return {
          id: "pinned",
          type: "pinned",
          nodes: tabable.tabs.map<TabNode>((tab) => {
            return {
              id: tab.id.toString(),
              type: "tab",
              tab: tab,
            };
          }),
        };
      }
      if (tabable instanceof TabGroup) {
        return {
          id: tabable.id.toString(),
          type: "tabGroup",
          tabGroup: tabable,
          nodes: tabable.tabs.map<TabNode>((tab) => {
            return {
              id: tab.id.toString(),
              type: "tab",
              tab: tab,
            };
          }),
        };
      }

      const tab = tabable as Tab;
      return {
        id: tab.id.toString(),
        type: "tab",
        tab: tab,
      };
    });
  };

  const [nodes, setNodes] = useState(nodesFromTabs(tabs));
  useEffect(() => {
    const tabs =
      selectedWindowIndex === 0
        ? windows.focusedWindowTabs
        : windows.unfocusedWindows.values[selectedWindowIndex - 1].tabs;
    setNodes(nodesFromTabs(tabs));
  }, [windows, selectedWindowIndex]);

  const rootNode: RootNode = {
    id: "root",
    type: "root",
    nodes: nodes,
  };

  const convertNodeToElement = (node: Node<NodeType>) => {
    if (node.type === "root") {
      const rootNode = node as RootNode;
      const children = rootNode.nodes.map((childNode) => {
        return convertNodeToElement(childNode);
      });
      return (
        <SortableContext
          id="root"
          items={rootNode.nodes.map((node) => node.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      );
    }

    if (node.type === "pinned") {
      const pinnedNode = node as PinnedNode;
      return <PinnedTabList tabs={pinnedNode.nodes.map((node) => node.tab)} />;
    }

    if (node.type === "tabGroup") {
      const tabGroupNode = node as TabGroupNode;
      return <GroupedTabList tabGroup={tabGroupNode.tabGroup} />;
    }

    const tabNode = node as TabNode;
    return (
      <SortableItem key={tabNode.id} id={tabNode.id.toString()}>
        <TabItem tab={tabNode.tab} />
      </SortableItem>
    );
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
  );

  const moveGroupTab = useMoveTabGroup();
  const moveTab = useMoveTab();
  const pinTab = usePinTab();
  const addTabToTabGroup = useAddTabToTabGroup();
  const moveTabOutOfGroup = useMoveTabOutOfGroup();

  const handleOnDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());
  };

  const handleOnDragEnd = (
    event: DragEndEvent & { data: { current: SortableData } },
  ) => {
    const { active, over } = event;

    if (!over) return;

    const source = findNodeById(active.id.toString(), nodes);
    const dest = findNodeById(over.id.toString(), nodes);
    if (!source || !dest) return;

    const destCurrentData = over.data.current;
    if (!destCurrentData) {
      if (dest.node.type === "pinned") {
        const sourceTab = (source.node as TabNode).tab;
        pinTab(sourceTab);
      }
      if (dest.node.type === "tabGroup") {
        const sourceTab = (source.node as TabNode).tab;
        const destTabGroup = (dest.node as TabGroupNode).tabGroup;
        addTabToTabGroup(sourceTab.id, destTabGroup.id);
      }

      return;
    }

    const sourceElementData = (active.data.current as SortableData).sortable;
    const destElementData = (over.data.current as SortableData).sortable;

    // FIXME: refactor codes
    if (source.node.type === "tabGroup") {
      if (destElementData.containerId === "root") {
        const currentIndex = source.indexInAll;
        const tabGroupNode = source.node as TabGroupNode;
        const targetIndex =
          currentIndex < dest.indexInAll
            ? dest.indexInAll - tabGroupNode.nodes.length + 1
            : dest.indexInAll;
        moveGroupTab(tabGroupNode.tabGroup.id, targetIndex);
      }
    }

    if (source.node.type === "tab") {
      if (sourceElementData.containerId === "root") {
        if (destElementData.containerId === "root") {
          const currentIndex = source.indexInAll;
          const targetIndex =
            currentIndex < dest.indexInAll && dest.node.type === "tabGroup"
              ? dest.indexInAll + (dest.node as TabGroupNode).nodes.length - 1
              : dest.indexInAll;
          moveTab((source.node as TabNode).tab.id, targetIndex);
        }
        if (destElementData.containerId === "pinned") {
          const sourceTab = (source.node as TabNode).tab;
          pinTab(sourceTab);
        }
        if (destElementData.containerId === "tabGroup") {
          const sourceTab = (source.node as TabNode).tab;
          const destTabGroup = (dest.node as TabGroupNode).tabGroup;
          addTabToTabGroup(sourceTab.id, destTabGroup.id);
        }
      }
      if (sourceElementData.containerId === "pinned") {
        if (destElementData.containerId === "root") {
          moveTab((source.node as TabNode).tab.id, dest.indexInAll);
        }
        if (destElementData.containerId === "pinned") {
          moveTab((source.node as TabNode).tab.id, dest.indexInAll);
        }
        if (destElementData.containerId === "tabGroup") {
          moveTab((source.node as TabNode).tab.id, dest.indexInAll);
        }
      }
      if (sourceElementData.containerId === "tabGroup") {
        if (destElementData.containerId === "root") {
          moveTabOutOfGroup((source.node as TabNode).tab.id, dest.indexInAll);
        }
        if (destElementData.containerId === "pinned") {
          pinTab((source.node as TabNode).tab);
        }
        if (destElementData.containerId === "tabGroup") {
          addTabToTabGroup(
            (source.node as TabNode).tab.id,
            (dest.node as TabGroupNode).tabGroup.id,
          );
        }
      }
    }

    setActiveId(null);
  };

  const getDragOverlay = useMemo(() => {
    if (!activeId) return null;

    const source = findNodeById(activeId, nodes);
    if (!source) return null;

    return convertNodeToElement(source.node);
  }, [activeId, nodes, convertNodeToElement]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
      >
        {convertNodeToElement(rootNode)}
        <DragOverlay>{getDragOverlay}</DragOverlay>
      </DndContext>
    </List>
  );
};

export default TabList;
