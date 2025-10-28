import { useDroppable } from "@dnd-kit/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import { alpha, useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import type { Window, WindowId } from "../../../../model/Window";
import { WindowActionMenu } from "../../shared/components/ActionMenu";

type WindowTabProps = {
  id: WindowId;
  windows: Window[];
  index: number;
  label: string;
  tabCount: number;
};

const WindowTab = (props: WindowTabProps) => {
  const { id, windows, index, label, tabCount, ...other } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { active, isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: "window",
    },
  });
  const droppable = active && isOver && active.data.current?.windowId !== id;
  const theme = useTheme();

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickWindowActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);
  const showIcon = Boolean(menuAnchorElement) || isHovered;

  return (
    <>
      <Tab
        ref={setNodeRef}
        sx={{
          bgcolor: droppable
            ? alpha(theme.palette.primary.light, 0.2)
            : undefined,
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
        icon={
          <Box
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <Chip
              label={tabCount}
              size="small"
              color="primary"
              sx={{ visibility: showIcon ? "hidden" : "visible" }}
            />
            <IconButton
              sx={{
                position: "absolute",
                visibility: showIcon ? "visible" : "hidden",
                p: 0,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              size="small"
              component="div"
              onClick={onClickWindowActionMenu}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        }
        iconPosition="end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <WindowActionMenu
        windows={windows}
        currentIndex={index}
        isOpenMenu={Boolean(menuAnchorElement)}
        anchorElement={menuAnchorElement}
        onCloseMenu={onCloseMenu}
      />
    </>
  );
};
WindowTab.muiName = "Tab";

export default WindowTab;
