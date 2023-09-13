import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const SortableItem = (props: SortableItemProps) => {
  const { id, style, children } = props;
  const {
    active,
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

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
