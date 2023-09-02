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
  DragOverEvent,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableData,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@mui/material/List";
import { useContext, useMemo, useState } from "react";

import { Tab } from "../../../../model/Tab";
import {
  TabGroup,
  isPinned,
  isTab,
  isTabGroup,
} from "../../../../model/TabContainer";
import {
  Window,
  WindowChild,
  findWindowChild,
  indexOfWindowChild,
} from "../../../../model/Window";
import { WindowsContext } from "../contexts/Windows";
import { useAddTabToTabGroup } from "../hooks/useAddTabToTabGroup";
import { useMoveTab } from "../hooks/useMoveTab";
import { useMoveTabGroup } from "../hooks/useMoveTabGroup";
import { usePinTab } from "../hooks/usePinTab";
import { useMoveTabOutOfGroup } from "../hooks/useTabOutOfTabGroup";

import GroupedTabList from "./GroupedTabList";
import PinnedTabList from "./PinnedTabList";
import TabItem from "./TabItem";

type TabListProps = {
  selectedWindowIndex: number;
};
type SortableItemProps = {
  id: string;
  isDragOverLay?: boolean;
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
        opacity: active?.id === id ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {children}
    </div>
  );
};

const convertToElement = (child: WindowChild) => {
  if (isPinned(child)) {
    return <PinnedTabList tabs={child.children} />;
  }
  if (isTabGroup(child)) {
    return <GroupedTabList tabGroup={child} />;
  }

  const tab = child as Tab;
  return (
    <SortableItem key={tab.id} id={tab.id.toString()}>
      <TabItem tab={tab} />
    </SortableItem>
  );
};

const selectedWindow = (windows: Window[], selectedIndex: number): Window => {
  if (selectedIndex === 0) {
    return windows.find((window) => window.focused);
  } else {
    return windows.filter((window) => !window.focused)[selectedIndex - 1];
  }
};

const TabList = (props: TabListProps) => {
  const { selectedWindowIndex } = props;
  const { windows, setWindows } = useContext(WindowsContext);
  const window = selectedWindow(windows, selectedWindowIndex);
  const [windowsBeforeDrag, setWidnowsBeforeDrag] = useState<Window[]>(null);
  const [activeId, setActiveId] = useState<string>(null);

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

  const onDragCancel = () => {
    if (windowsBeforeDrag) {
      setWindows(windowsBeforeDrag);
    }

    setActiveId(null);
    setWidnowsBeforeDrag(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());
    setWidnowsBeforeDrag(windows);
  };

  const onDragOver = (
    event: DragOverEvent & { data: { current: SortableData } },
  ) => {
    const { active, over } = event;

    if (!over) return;

    const source = findWindowChild(
      window,
      active.id === "pinned" ? active.id : Number(active.id),
    );
    const dest = findWindowChild(
      window,
      over.id === "pinned" ? over.id : Number(over.id),
    );

    if (!source || !dest) return;

    const currentIndex = window.children.findIndex(
      (child) => child.id === source.id,
    );
    const destIndex = window.children.findIndex(
      (child) => child.id === dest.id,
    );
    const children = arrayMove(window.children, currentIndex, destIndex);
    const newWindows = windows.map((childWindow) => {
      if (childWindow.id === window.id) {
        return {
          ...childWindow,
          children,
        };
      }
      return childWindow;
    });

    setWindows(newWindows);
  };

  const onDragEnd = (
    event: DragEndEvent & { data: { current: SortableData } },
  ) => {
    const { active, over } = event;

    if (!over) return;

    const windowBeforeDrag = selectedWindow(
      windowsBeforeDrag,
      selectedWindowIndex,
    );
    const source = findWindowChild(
      windowBeforeDrag,
      active.id === "pinned" ? active.id : Number(active.id),
    );
    const dest = findWindowChild(
      window,
      over.id === "pinned" ? over.id : Number(over.id),
    );

    if (!source || !dest) return;

    const sourceData = (active.data.current as SortableData).sortable;
    const destData = (over.data.current as SortableData).sortable;

    const sourceIsInRoot = sourceData.containerId === "root";
    const sourceIsInPinned = sourceData.containerId === "pinned";
    const sourceIsInTabGroup =
      findWindowChild(windowBeforeDrag, Number(sourceData.containerId)) &&
      isTabGroup(
        findWindowChild(windowBeforeDrag, Number(sourceData.containerId)),
      );
    const destIsInRoot = destData.containerId === "root";
    const destIsInPinned = destData.containerId === "pinned";
    const destIsInTabGroup =
      findWindowChild(windowBeforeDrag, Number(destData.containerId)) &&
      isTabGroup(
        findWindowChild(windowBeforeDrag, Number(destData.containerId)),
      );

    if (isTabGroup(source)) {
      if (destIsInRoot) {
        const destIndex = indexOfWindowChild(window, dest.id);
        moveGroupTab(source.id, destIndex);
      }
    }

    if (isTab(source)) {
      if (sourceIsInRoot) {
        if (destIsInRoot) {
          const currentIndex = indexOfWindowChild(windowBeforeDrag, source.id);
          const destIndex = indexOfWindowChild(window, dest.id);
          const targetIndex =
            currentIndex < destIndex && isTabGroup(dest)
              ? destIndex + dest.children.length - 1
              : destIndex;
          moveTab(source.id, targetIndex);
        }
        if (destIsInPinned) {
          pinTab(source.id);
        }
        if (destIsInTabGroup) {
          const destTabGroup = findWindowChild(
            windowBeforeDrag,
            Number(destData.containerId),
          ) as TabGroup;
          addTabToTabGroup(source.id, destTabGroup.id);
        }
      }

      if (sourceIsInPinned) {
        if (destIsInRoot) {
          moveTab(source.id, indexOfWindowChild(window, dest.id));
        }
        if (destIsInPinned) {
          moveTab(source.id, indexOfWindowChild(window, dest.id));
        }
        if (destIsInTabGroup) {
          moveTab(source.id, indexOfWindowChild(window, dest.id));
        }
      }

      if (sourceIsInTabGroup) {
        if (destIsInRoot) {
          moveTabOutOfGroup(source.id, indexOfWindowChild(window, dest.id));
        }
        if (destIsInPinned) {
          pinTab(source.id);
        }
        if (destIsInTabGroup) {
          addTabToTabGroup(source.id, Number(destData.containerId));
        }
      }
    }

    setActiveId(null);
  };

  const getDragOverlay = useMemo(() => {
    if (!activeId) return null;

    const window = selectedWindow(windows, selectedWindowIndex);
    const source = findWindowChild(
      window,
      activeId === "pinned" ? activeId : Number(activeId),
    );
    if (!source) return null;

    return convertToElement(source);
  }, [activeId]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragCancel={onDragCancel}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        {window && (
          <>
            <SortableContext
              id="root"
              items={window.children.map((child) => child.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {window.children.map((child) => convertToElement(child))}
            </SortableContext>
            <DragOverlay>{getDragOverlay}</DragOverlay>
          </>
        )}
      </DndContext>
    </List>
  );
};

export default TabList;
