import { useDroppable } from "@dnd-kit/core";
import Chip from "@mui/material/Chip";
import { blue, grey } from "@mui/material/colors";
import Tab from "@mui/material/Tab";

import { WindowId } from "../../../../model/Window";

type WindowTabProps = {
  id: WindowId;
  label: string;
  tabCount: number;
};

const WindowTab = (props: WindowTabProps) => {
  const { id, label, tabCount, ...other } = props;
  const { active, isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: "window",
    },
  });
  const droppable = active && isOver && active.data.current?.windowId !== id;

  return (
    <Tab
      ref={setNodeRef}
      sx={{
        bgcolor: droppable ? blue[100] : undefined,
        borderColor: droppable ? "primary.main" : undefined,
        borderWidth: droppable ? 1 : undefined,
        borderStyle: droppable ? "solid" : undefined,
        color: droppable ? grey[700] : undefined,
      }}
      style={{
        textTransform: "none",
        borderRadius: isOver ? "4px" : undefined,
      }}
      label={label}
      {...other}
      icon={<Chip label={tabCount} size="small" color="info" />}
      iconPosition="end"
    />
  );
};
WindowTab.muiName = "Tab";

export default WindowTab;
