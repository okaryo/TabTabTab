import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WindowId } from "../../model/Window";

type SortableItemProps = {
  id: string;
  data: {
    type: "window" | "tabGroup" | "tab";
    parentType: "window" | "tabGroup" | "pinned";
    windowId: WindowId;
  };
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const SortableItem = (props: SortableItemProps) => {
  const { id, data, style, children } = props;
  const {
    active,
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    data,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        ...style,
        cursor: isDragging ? "grabbing" : "pointer",
        opacity: active?.id === id ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {children}
    </div>
  );
};

export default SortableItem;
