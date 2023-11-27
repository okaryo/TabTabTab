/* eslint @typescript-eslint/no-floating-promises: 0, @typescript-eslint/no-misused-promises: 0 */

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableData } from "@dnd-kit/sortable";
import { useContext, useEffect, useMemo, useState } from "react";

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

import SortableTabs from "./SortableTabs";
import TabGroupContainer from "./TabGroupContainer";
import TabItem from "./TabItem";
import TabList from "./TabList";
import WindowTabs from "./WindowTabs";

const WindowsContainer = () => {
  const { windows, setWindows } = useContext(WindowsContext);
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);
  const window = windows[selectedWindowIndex];
  const [windowsBeforeDrag, setWindowsBeforeDrag] = useState<Window[]>(null);
  const [activeId, setActiveId] = useState<string>(null);
  const [pinnedCollapsed, setPinnedCollapsed] = useState(true);

  useEffect(() => {
    if (selectedWindowIndex >= windows.length) {
      setSelectedWindowIndex(0);
    }
  }, [windows.length, selectedWindowIndex]);

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
    setWindowsBeforeDrag(null);
  };

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id.toString());
    setWindowsBeforeDrag(windows);
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
        if (isTabGroup(source)) return;

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
      if (!destContainer || destIndex === -1) return;

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

    const windowBeforeDrag = windowsBeforeDrag[selectedWindowIndex];
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

    const window = windows[selectedWindowIndex];
    const source = findWindowChild(
      window,
      activeId === "pinned" ? activeId : Number(activeId),
    );
    if (!source) return null;

    if (isTabGroup(source)) {
      return (
        <div style={{ cursor: "grabbing" }}>
          <TabGroupContainer tabGroup={source}>
            <SortableTabs id={source.id.toString()} tabs={source.children} />
          </TabGroupContainer>
        </div>
      );
    }

    const tab = source as Tab;
    return (
      <div style={{ cursor: "grabbing" }}>
        <TabItem tab={tab} />
      </div>
    );
  }, [activeId, selectedWindowIndex, windows]);

  return (
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
      <WindowTabs
        selectedIndex={selectedWindowIndex}
        onSelectIndex={setSelectedWindowIndex}
      />
      <TabList
        selectedWindowIndex={selectedWindowIndex}
        pinnedCollapsed={pinnedCollapsed}
        setPinnedCollapsed={setPinnedCollapsed}
      />
      <DragOverlay>{getDragOverlay}</DragOverlay>
    </DndContext>
  );
};

export default WindowsContainer;
