import {
  Active,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DroppableContainer,
  MeasuringStrategy,
  MouseSensor,
  Over,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { RectMap } from "@dnd-kit/core/dist/store/types";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { SortableData } from "@dnd-kit/sortable";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  addTabToTabGroup,
  moveTabGroup,
  moveTabGroupToOtherWindow,
} from "../../data/repository/TabGroupRepository";
import {
  moveTab,
  moveTabOutOfGroup,
  moveTabToOtherWindow,
  unpinTab,
} from "../../data/repository/TabsRepository";
import {
  addWindowWithTab,
  addWindowWithTabGroup,
} from "../../data/repository/WindowsRepository";
import { Tab } from "../../model/Tab";
import {
  TabGroup,
  isPinned,
  isPinnedId,
  isTab,
  isTabContainer,
  isTabGroup,
} from "../../model/TabContainer";
import {
  Window,
  findParentContainer,
  findWindow,
  findWindowChild,
  indexOfWindowChild,
  moveTabOrTabGroup,
} from "../../model/Window";
import { WindowsContext } from "../contexts/WindowsContext";
import { moveTabFromPinnedToPinned } from "../functions/moveTabFromPinnedToPinned";
import { moveTabFromRootToPinned } from "../functions/moveTabFromRootToPinned";
import TabGroupContainer from "./TabGroupContainer";
import TabItem from "./TabItem";

type DragAndDropContextProps = {
  children: React.ReactNode;
};

export const DROPPABLE_EMPTY_WINDOW_COLUMN_ID = "DROPPABLE_EMPTY_WINDOW_COLUMN";
export const DROPPABLE_WINDOW_COLUMN_ID_PREFIX = "DROPPABLE_WINDOW_COLUMN/";

const DragAndDropContext = (props: DragAndDropContextProps) => {
  const { children } = props;
  const { windows, setWindows } = useContext(WindowsContext);
  const [windowsBeforeDrag, setWindowsBeforeDrag] = useState<Window[]>(null);
  const [originWindowId, setOriginWindowId] = useState<number>(null);
  const [activeItem, setActiveItem] = useState<
    Active & { data: { current: { windowId?: number } } }
  >(null);
  const [overItem, setOverItem] = useState<Over>(null);

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

  const onDragCancel = () => {
    if (windowsBeforeDrag) {
      setWindows(windowsBeforeDrag);
    }

    setActiveItem(null);
    setOverItem(null);
    setWindowsBeforeDrag(null);
  };

  const onDragStart = (
    event: DragStartEvent & {
      active: { data: { current: { windowId: number } } };
    },
  ) => {
    const { active } = event;

    setOriginWindowId(active.data.current.windowId);
    setActiveItem(active);
    setWindowsBeforeDrag(windows);
  };

  const onDragOver = useCallback(
    (
      event: DragOverEvent & {
        active: { data: { current: { windowId?: number } } };
        over: { data: { current: { windowId?: number } } };
      },
    ) => {
      const { active, over } = event;

      if (!over) return;

      setOverItem(over);

      if (active.id === over.id) {
        return;
      }

      if (over.id.toString().startsWith(DROPPABLE_WINDOW_COLUMN_ID_PREFIX)) {
        const destWindowId = Number(
          over.id
            .toString()
            .substring(DROPPABLE_WINDOW_COLUMN_ID_PREFIX.length),
        );
        const destWindow = findWindow(windows, destWindowId);
        const sourceWindow = findWindow(windows, active.data.current?.windowId);
        const source = findWindowChild(
          windows,
          isPinnedId(active.id) ? active.id : Number(active.id),
        );
        const newWindows = moveTabOrTabGroup(
          windows,
          Number(source.id),
          sourceWindow.id,
          destWindowId,
          destWindowId,
          destWindow.children.length,
        );
        setWindows(newWindows);
        return;
      }

      const sourceWindow = findWindow(windows, active.data.current?.windowId);
      const source = findWindowChild(
        windows,
        isPinnedId(active.id) ? active.id : Number(active.id),
      );
      const destWindow = findWindow(windows, over.data.current?.windowId);
      const dest = findWindowChild(
        windows,
        isPinnedId(over.id) ? over.id : Number(over.id),
      );

      if (!source || !dest) return;

      const isOverContainerHeader = over.data.current?.sortable === undefined;
      if (isOverContainerHeader) return;

      const destContainer = findParentContainer(destWindow, dest.id);
      const destIndex = destContainer?.children.findIndex(
        (child) => child.id === dest.id,
      );
      if (!destContainer || destIndex === -1) return;

      const newWindows = moveTabOrTabGroup(
        windows,
        Number(source.id),
        sourceWindow.id,
        destWindow.id,
        destContainer.id,
        destIndex,
      );
      setWindows(newWindows);
    },
    [windows, setWindows],
  );

  const onDragEnd = async (
    event: DragEndEvent & {
      active: { data: { current: { windowId?: number } } };
      over: {
        data: {
          current: SortableData & { windowId?: number; collapsed?: boolean };
        };
      };
    },
  ) => {
    const { active, over } = event;

    if (!over) return;

    const resetState = () => {
      setActiveItem(null);
      setOverItem(null);
      setWindowsBeforeDrag(null);
    };

    if (over.data.current?.type === "window") {
      const isSameWindow = active.data.current?.windowId === over.id;
      if (isSameWindow) {
        setWindows(windowsBeforeDrag);
      }
      if (!isSameWindow && active.data.current?.type === "tabGroup") {
        moveTabGroupToOtherWindow(Number(active.id), Number(over.id));
      }
      if (!isSameWindow && active.data.current?.type === "tab") {
        moveTabToOtherWindow(Number(active.id), Number(over.id));
      }

      resetState();

      return;
    }

    if (over.id === DROPPABLE_EMPTY_WINDOW_COLUMN_ID) {
      if (active.data.current?.type === "tabGroup") {
        const tabGroup = findWindowChild(windowsBeforeDrag, Number(active.id));
        if (tabGroup && isTabGroup(tabGroup)) {
          addWindowWithTabGroup(tabGroup);
        }
      }
      if (active.data.current?.type === "tab") {
        addWindowWithTab(Number(active.id));
      }

      resetState();

      return;
    }

    if (over.id.toString().startsWith(DROPPABLE_WINDOW_COLUMN_ID_PREFIX)) {
      const destWindowId = Number(
        over.id.toString().substring(DROPPABLE_WINDOW_COLUMN_ID_PREFIX.length),
      );

      if (active.data.current?.type === "tabGroup") {
        moveTabGroup(Number(active.id), originWindowId, destWindowId, -1);
      }
      if (active.data.current?.type === "tab") {
        moveTab(Number(active.id), destWindowId, -1);
      }

      resetState();

      return;
    }

    const sourceWindow = findWindow(windowsBeforeDrag, originWindowId);
    const destWindow = findWindow(windows, over.data.current?.windowId);
    const source = findWindowChild(
      sourceWindow,
      isPinnedId(active.id) ? active.id : Number(active.id),
    );
    const dest = findWindowChild(
      destWindow,
      isPinnedId(over.id) ? over.id : Number(over.id),
    );

    if (!source || !dest) return;

    const sourceContainerBeforeDrag = findParentContainer(
      windowsBeforeDrag,
      source.id,
    );
    const destContainer = findParentContainer(windows, dest.id);

    const sourceIsInRoot = sourceContainerBeforeDrag.id === sourceWindow.id;
    const sourceIsInPinned = isPinnedId(sourceContainerBeforeDrag.id);
    const sourceIsInTabGroup =
      findWindowChild(sourceWindow, sourceContainerBeforeDrag.id) &&
      isTabGroup(findWindowChild(sourceWindow, sourceContainerBeforeDrag.id));
    const destIsInRoot = destContainer.id === destWindow.id;
    const destIsInPinned = isPinnedId(destContainer.id);
    const destIsInTabGroup =
      findWindowChild(destWindow, destContainer.id) &&
      isTabGroup(findWindowChild(destWindow, destContainer.id));

    if (isTabGroup(source)) {
      if (destIsInRoot) {
        const destIndex = indexOfWindowChild(destWindow, dest.id);
        await moveTabGroup(
          source.id,
          sourceWindow.id,
          destWindow.id,
          destIndex,
        );
      }
    }

    if (isTab(source)) {
      if (sourceIsInRoot) {
        if (destIsInRoot && !isTabContainer(dest)) {
          const currentIndex = indexOfWindowChild(sourceWindow, source.id);
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          const targetIndex =
            currentIndex < destIndex && isTabGroup(dest)
              ? destIndex + dest.children.length - 1
              : destIndex;
          await moveTab(source.id, destWindow.id, targetIndex);
        }
        // NOTE: When dropping on tab container header
        if (destIsInRoot && isTabContainer(dest)) {
          if (isPinned(dest)) {
            const pinnedCollapsed = over.data.current?.collapsed;
            const destIndex = pinnedCollapsed ? dest.children.length : 0;
            await moveTabFromRootToPinned(source.id, destWindow.id, destIndex);
          }
          if (isTabGroup(dest)) {
            const destIndex = dest.collapsed
              ? indexOfWindowChild(destWindow, dest.children[-1].id)
              : indexOfWindowChild(destWindow, dest.children[0].id);
            await addTabToTabGroup(source.id, dest.id);
            await moveTab(source.id, destWindow.id, destIndex);
          }
        }
        if (destIsInPinned) {
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          await moveTabFromRootToPinned(source.id, destWindow.id, destIndex);
        }
        if (destIsInTabGroup) {
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
      }

      if (sourceIsInPinned) {
        const destIndex = indexOfWindowChild(destWindow, dest.id);

        if (destIsInRoot && !isTabContainer(dest)) {
          await unpinTab(source.id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
        // NOTE: When dropping on tab container header
        if (destIsInRoot && isTabContainer(dest)) {
          if (isPinned(dest)) {
            const pinnedCollapsed = over.data.current?.collapsed;
            await moveTabFromPinnedToPinned(
              source.id,
              sourceWindow.id,
              destWindow.id,
              pinnedCollapsed ? dest.children.length : 0,
            );
          }
          if (isTabGroup(dest)) {
            const index = dest.collapsed
              ? indexOfWindowChild(destWindow, dest.children[-1].id)
              : indexOfWindowChild(destWindow, dest.children[0].id);
            await addTabToTabGroup(source.id, dest.id);
            await moveTab(source.id, destWindow.id, index);
          }
        }
        if (destIsInPinned) {
          await moveTabFromPinnedToPinned(
            source.id,
            sourceWindow.id,
            destWindow.id,
            destIndex,
          );
        }
        if (destIsInTabGroup) {
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
      }

      if (sourceIsInTabGroup) {
        const destIndex = indexOfWindowChild(destWindow, dest.id);

        if (destIsInRoot && !isTabContainer(dest)) {
          await moveTabOutOfGroup(source.id, destWindow.id, destIndex);
        }
        // NOTE: When dropping on tab container header
        if (destIsInRoot && isTabContainer(dest)) {
          if (isPinned(dest)) {
            const pinnedCollapsed = over.data.current?.collapsed;
            await moveTabFromRootToPinned(
              source.id,
              destWindow.id,
              pinnedCollapsed ? dest.children.length : 0,
            );
          }
          if (isTabGroup(dest)) {
            const index = dest.collapsed
              ? indexOfWindowChild(destWindow, dest.children[-1].id)
              : indexOfWindowChild(destWindow, dest.children[0].id);
            await addTabToTabGroup(source.id, dest.id);
            await moveTab(source.id, destWindow.id, index);
          }
        }
        if (destIsInPinned) {
          await moveTabFromRootToPinned(source.id, destWindow.id, destIndex);
        }
        if (destIsInTabGroup) {
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
      }
    }

    resetState();
  };

  const lastPointerPosition = useRef<Coordinates>(null);
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args: {
      active: Active & { data: { current: { windowId?: number } } };
      collisionRect: DOMRect;
      droppableRects: RectMap;
      droppableContainers: DroppableContainer[];
      pointerCoordinates: Coordinates | null;
    }) => {
      const { active, droppableContainers, pointerCoordinates } = args;

      const draggedItem = findWindowChild(
        windows,
        isPinnedId(active.id) ? active.id : Number(active.id),
      );

      // NOTE: Ensure that if the dragged item is a TabGroup and it is expanded, items within the group are not considered for dropping.
      if (isTabGroup(draggedItem) && !draggedItem.collapsed) {
        const isMovingUpwards =
          pointerCoordinates &&
          lastPointerPosition.current &&
          pointerCoordinates.y <= lastPointerPosition.current.y;
        lastPointerPosition.current = pointerCoordinates;

        const collisionArgs = {
          ...args,
          droppableContainers: droppableContainers.filter((container) => {
            if (
              container.id === DROPPABLE_EMPTY_WINDOW_COLUMN_ID ||
              container.id
                .toString()
                .startsWith(DROPPABLE_WINDOW_COLUMN_ID_PREFIX)
            ) {
              return true;
            }

            const containerId = isPinnedId(container.id)
              ? container.id
              : Number(container.id);
            const parentContainer = findParentContainer(windows, containerId);
            return parentContainer && draggedItem.id !== parentContainer.id;
          }),
        };
        // NOTE: Adjust collision detection for downward movements to be more responsive.
        if (isMovingUpwards) {
          return pointerWithin(collisionArgs);
        }
        return closestCenter(collisionArgs);
      }

      return pointerWithin(args);
    },
    [windows],
  );

  const getDragOverlay = useMemo(() => {
    if (!activeItem || !overItem) return null;

    const source = findWindowChild(
      windows,
      isPinnedId(activeItem.id) ? activeItem.id : Number(activeItem.id),
    );
    if (!source) return null;

    if (isTabGroup(source)) {
      return (
        <div
          style={{
            cursor: "grabbing",
            opacity: overItem?.data?.current?.type === "window" ? "0.5" : "1",
          }}
        >
          <TabGroupContainer tabGroup={source}>
            {source.children.map((tab) => (
              <TabItem key={tab.id} tab={tab} />
            ))}
          </TabGroupContainer>
        </div>
      );
    }

    const tab = source as Tab;
    return (
      <div
        style={{
          cursor: "grabbing",
          opacity: overItem?.data?.current?.type === "window" ? "0.5" : "1",
        }}
      >
        <TabItem tab={tab} cursorGrabbing />
      </div>
    );
  }, [activeItem, overItem, windows]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
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
      {children}
      <DragOverlay>{getDragOverlay}</DragOverlay>
    </DndContext>
  );
};

export default DragAndDropContext;
