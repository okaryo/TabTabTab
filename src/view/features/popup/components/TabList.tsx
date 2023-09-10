/* eslint @typescript-eslint/no-floating-promises: 0, @typescript-eslint/no-misused-promises: 0 */

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
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import List from "@mui/material/List";
import { useContext, useMemo, useState } from "react";

import { Tab } from "../../../../model/Tab";
import {
  TabContainer,
  TabGroup,
  isPinned,
  isTab,
  isTabGroup,
} from "../../../../model/TabContainer";
import {
  Window,
  WindowChild,
  findParentContainer,
  findWindowChild,
  indexOfWindowChild,
  moveTabOrTabGroup,
} from "../../../../model/Window";
import { unpinTab } from "../../../../repository/TabsRepository";
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
  const [pinnedCollapsed, setPinnedCollapsed] = useState(true);

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

  const convertToElement = (child: WindowChild) => {
    if (isPinned(child)) {
      return (
        <PinnedTabList
          pinned={child}
          collapsed={pinnedCollapsed}
          toggleCollapsed={() => setPinnedCollapsed(!pinnedCollapsed)}
        />
      );
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

    let newWindow: Window;
    const isOverContainerHeader = over.data.current?.sortable === undefined;

    if (isOverContainerHeader) {
      const destContainer = findWindowChild(
        window,
        dest.id === "pinned" ? dest.id : Number(dest.id),
      );
      if (!destContainer) return;

      let destIndex: number;
      if (isPinned(destContainer)) {
        destIndex = pinnedCollapsed ? destContainer.children.length : 0;
        newWindow = moveTabOrTabGroup(
          window,
          Number(source.id),
          destContainer.id,
          destIndex,
        );
      }
      if (isTabGroup(destContainer)) {
        destIndex = destContainer.collapsed ? destContainer.children.length : 0;
        newWindow = moveTabOrTabGroup(
          window,
          Number(source.id),
          destContainer.id,
          destIndex,
        );
      }
    } else {
      const destContainer = findParentContainer(window, dest.id);
      const destIndex = destContainer?.children.findIndex(
        (child) => child.id === dest.id,
      );
      if (!destContainer || !destIndex) return;

      newWindow = moveTabOrTabGroup(
        window,
        Number(source.id),
        destContainer.id,
        destIndex,
      );
    }
    const newWindows = windows.map((childWindow) => {
      if (childWindow.id === newWindow.id) return newWindow;

      return childWindow;
    });

    setWindows(newWindows);
  };

  const onDragEnd = async (
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

    const isOverContainerHeader = over.data.current?.sortable === undefined;
    const sourceContainerBeforeDrag = findParentContainer(
      windowBeforeDrag,
      source.id,
    );
    const destContainer = findParentContainer(window, dest.id);

    const sourceIsInRoot = sourceContainerBeforeDrag.id === window.id;
    const sourceIsInPinned = sourceContainerBeforeDrag.id === "pinned";
    const sourceIsInTabGroup =
      findWindowChild(windowBeforeDrag, sourceContainerBeforeDrag.id) &&
      isTabGroup(
        findWindowChild(windowBeforeDrag, sourceContainerBeforeDrag.id),
      );
    const destIsInRoot = destContainer.id === window.id;
    const destIsInPinned = destContainer.id === "pinned";
    const destIsInTabGroup =
      findWindowChild(windowBeforeDrag, destContainer.id) &&
      isTabGroup(findWindowChild(windowBeforeDrag, destContainer.id));

    if (isTabGroup(source)) {
      if (destIsInRoot) {
        const destIndex = indexOfWindowChild(window, dest.id);
        moveGroupTab(source.id, destIndex);
      }
    }

    if (isTab(source) && isOverContainerHeader) {
      const sourceContainer = findParentContainer(
        window,
        source.id,
      ) as TabContainer;

      if (isPinned(sourceContainer)) {
        if (pinnedCollapsed) {
          await pinTab(source.id);
        } else {
          await pinTab(source.id);
          await moveTab(source.id, 0);
        }
      }

      if (isTabGroup(sourceContainer)) {
        if (!sourceContainer.collapsed) {
          await addTabToTabGroup(source.id, sourceContainer.id);
          await moveTab(source.id, 0);
        }
      }
    }

    if (isTab(source) && !isOverContainerHeader) {
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
          const destIndex = indexOfWindowChild(window, dest.id);
          await pinTab(source.id);
          await moveTab(source.id, destIndex);
        }
        if (destIsInTabGroup) {
          const destIndex = indexOfWindowChild(window, dest.id);
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destIndex);
        }
      }

      if (sourceIsInPinned) {
        if (destIsInRoot) {
          unpinTab(source.id);
          moveTab(source.id, indexOfWindowChild(window, dest.id));
        }
        if (destIsInPinned) {
          moveTab(source.id, indexOfWindowChild(window, dest.id));
        }
        if (destIsInTabGroup) {
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, indexOfWindowChild(window, dest.id));
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
          const destIndex = indexOfWindowChild(window, dest.id);
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destIndex);
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

    if (isTabGroup(source)) {
      return <GroupedTabList tabGroup={source} />;
    }

    const tab = source as Tab;
    return <TabItem tab={tab} />;
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
          <SortableContext
            id={window.id.toString()}
            items={window.children.map((child) => child.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {window.children.map((child) => convertToElement(child))}
          </SortableContext>
        )}
        <DragOverlay>{getDragOverlay}</DragOverlay>
      </DndContext>
    </List>
  );
};

export default TabList;
