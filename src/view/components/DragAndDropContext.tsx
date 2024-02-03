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
  TabContainer,
  TabGroup,
  isPinned,
  isPinnedId,
  isTab,
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
import SortableTabs from "../features/popup/components/SortableTabs";
import TabGroupContainer from "../features/popup/components/TabGroupContainer";
import TabItem from "../features/popup/components/TabItem";
import { useAddTabToTabGroup } from "../features/popup/hooks/useAddTabToTabGroup";
import { useMoveTab } from "../features/popup/hooks/useMoveTab";
import { useMoveTabGroup } from "../features/popup/hooks/useMoveTabGroup";
import { useMoveTabGroupToOtherWindow } from "../features/popup/hooks/useMoveTabGroupToOtherWindow";
import { useMoveTabToOtherWindow } from "../features/popup/hooks/useMoveTabToOtherWindow";
import { usePinTab } from "../features/popup/hooks/usePinTab";
import { useMoveTabOutOfGroup } from "../features/popup/hooks/useTabOutOfTabGroup";
import { useUnpinTab } from "../features/popup/hooks/useUnpinTab";

type DragAndDropContextProps = {
  children: React.ReactNode;
};

export const DROPPABLE_EMPTY_WINDOW_CONTAINER_ID = "empty-window";

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

  const moveGroupTab = useMoveTabGroup();
  const moveTab = useMoveTab();
  const pinTab = usePinTab();
  const unpinTab = useUnpinTab();
  const addTabToTabGroup = useAddTabToTabGroup();
  const moveTabOutOfGroup = useMoveTabOutOfGroup();
  const moveTabToOtherWindow = useMoveTabToOtherWindow();
  const moveTabGroupToOtherWindow = useMoveTabGroupToOtherWindow();
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

    if (over.id === DROPPABLE_EMPTY_WINDOW_CONTAINER_ID) {
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

    const isOverContainerHeader = over.data.current?.sortable === undefined;
    const sourceContainerBeforeDrag = findParentContainer(
      windowsBeforeDrag,
      source.id,
    );
    const destContainer = findParentContainer(windows, dest.id);

    const sourceIsInRoot = sourceContainerBeforeDrag.id === sourceWindow.id;
    const sourceIsInPinned = sourceContainerBeforeDrag.id === "pinned";
    const sourceIsInTabGroup =
      findWindowChild(sourceWindow, sourceContainerBeforeDrag.id) &&
      isTabGroup(findWindowChild(sourceWindow, sourceContainerBeforeDrag.id));
    const destIsInRoot = destContainer.id === destWindow.id;
    const destIsInPinned = destContainer.id === "pinned";
    const destIsInTabGroup =
      findWindowChild(destWindow, destContainer.id) &&
      isTabGroup(findWindowChild(destWindow, destContainer.id));

    if (isTabGroup(source)) {
      if (destIsInRoot) {
        const destIndex = indexOfWindowChild(destWindow, dest.id);
        moveGroupTab(source.id, sourceWindow.id, destWindow.id, destIndex);
      }
    }

    if (isTab(source) && isOverContainerHeader) {
      const destContainer = findWindowChild(
        destWindow,
        dest.id,
      ) as TabContainer;

      if (isPinned(destContainer)) {
        const pinnedCollapsed = over.data.current?.collapsed;
        if (pinnedCollapsed) {
          await pinTab(source.id);
        } else {
          await pinTab(source.id);
          await moveTab(source.id, destWindow.id, 0);
        }
      }

      if (isTabGroup(destContainer)) {
        if (!destContainer.collapsed) {
          await addTabToTabGroup(source.id, destContainer.id);
          await moveTab(source.id, destWindow.id, 0);
        }
      }
    }

    if (isTab(source) && !isOverContainerHeader) {
      if (sourceIsInRoot) {
        if (destIsInRoot) {
          const currentIndex = indexOfWindowChild(sourceWindow, source.id);
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          const targetIndex =
            currentIndex < destIndex && isTabGroup(dest)
              ? destIndex + dest.children.length - 1
              : destIndex;
          moveTab(source.id, destWindow.id, targetIndex);
        }
        if (destIsInPinned) {
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          await pinTab(source.id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
        if (destIsInTabGroup) {
          const destIndex = indexOfWindowChild(destWindow, dest.id);
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(source.id, destWindow.id, destIndex);
        }
      }

      if (sourceIsInPinned) {
        if (destIsInRoot) {
          unpinTab(source.id);
          moveTab(
            source.id,
            destWindow.id,
            indexOfWindowChild(destWindow, dest.id),
          );
        }
        if (destIsInPinned) {
          moveTab(
            source.id,
            destWindow.id,
            indexOfWindowChild(destWindow, dest.id),
          );
        }
        if (destIsInTabGroup) {
          await addTabToTabGroup(source.id, (destContainer as TabGroup).id);
          await moveTab(
            source.id,
            destWindow.id,
            indexOfWindowChild(destWindow, dest.id),
          );
        }
      }

      if (sourceIsInTabGroup) {
        if (destIsInRoot) {
          moveTabOutOfGroup(
            source.id,
            destWindow.id,
            indexOfWindowChild(destWindow, dest.id),
          );
        }
        if (destIsInPinned) {
          pinTab(source.id);
        }
        if (destIsInTabGroup) {
          const destIndex = indexOfWindowChild(destWindow, dest.id);
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