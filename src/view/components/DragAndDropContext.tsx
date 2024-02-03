/* eslint @typescript-eslint/no-floating-promises: 0, @typescript-eslint/no-misused-promises: 0 */

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
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { RectMap } from "@dnd-kit/core/dist/store/types";
import { Coordinates } from "@dnd-kit/core/dist/types";
import { SortableData } from "@dnd-kit/sortable";
import { useCallback, useContext, useMemo, useState } from "react";

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
import { WindowsContext } from "../contexts/Windows";
import { useAddWindowWithTab } from "../features/options/hooks/useAddWindowWithTab";
import { useAddWindowWithTabGroup } from "../features/options/hooks/useAddWindowWithTabGroup";
import { useAddTabToTabGroup } from "../hooks/useAddTabToTabGroup";
import { useMoveTab } from "../hooks/useMoveTab";
import { useMoveTabFromPinnedToPinned } from "../hooks/useMoveTabFromPinnedToPinned";
import { useMoveTabFromRootToPinned } from "../hooks/useMoveTabFromRootToPinned";
import { useMoveTabGroup } from "../hooks/useMoveTabGroup";
import { useMoveTabGroupToOtherWindow } from "../hooks/useMoveTabGroupToOtherWindow";
import { useMoveTabToOtherWindow } from "../hooks/useMoveTabToOtherWindow";
import { useMoveTabOutOfGroup } from "../hooks/useTabOutOfTabGroup";
import { useUnpinTab } from "../hooks/useUnpinTab";

import SortableTabs from "./SortableTabs";
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

  const moveTabGroup = useMoveTabGroup();
  const moveTab = useMoveTab();
  const unpinTab = useUnpinTab();
  const addTabToTabGroup = useAddTabToTabGroup();
  const moveTabOutOfGroup = useMoveTabOutOfGroup();
  const moveTabToOtherWindow = useMoveTabToOtherWindow();
  const moveTabGroupToOtherWindow = useMoveTabGroupToOtherWindow();
  const moveTabFromRootToPinned = useMoveTabFromRootToPinned();
  const moveTabFromPinnedToPinned = useMoveTabFromPinnedToPinned();
  const addWindowWithTab = useAddWindowWithTab();
  const addWindowWithTabGroup = useAddWindowWithTabGroup();

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

      if (active.id === over.id) {
        setOverItem(over);
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
        setOverItem(over);
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
      setOverItem(over);
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
      if (active.data.current?.type === "tabGroup") {
        moveTabGroupToOtherWindow(Number(active.id), Number(over.id));
      }
      if (active.data.current?.type === "tab") {
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
        // When dropping on tab container header
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
        // When dropping on tab container header
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
        // When dropping on tab container header
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

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args: {
      active: Active & { data: { current: { windowId?: number } } };
      collisionRect: DOMRect;
      droppableRects: RectMap;
      droppableContainers: DroppableContainer[];
      pointerCoordinates: Coordinates | null;
    }) => {
      const { active } = args;
      const window = findWindow(windows, active.data.current?.windowId);

      return pointerWithin({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) => {
          return window && container.id.toString() !== window.id.toString();
        }),
      });
    },
    [windows],
  );

  const getDragOverlay = useMemo(() => {
    if (!activeItem || !overItem) return null;

    const source = findWindowChild(
      windows,
      activeItem.id === "pinned" ? activeItem.id : Number(activeItem.id),
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
            <SortableTabs
              id={source.id.toString()}
              parentType="tabGroup"
              windowId={activeItem.data.current?.windowId}
              tabs={source.children}
            />
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
        <TabItem tab={tab} />
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
