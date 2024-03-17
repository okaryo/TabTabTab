import { useDroppable } from "@dnd-kit/core";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPin from "@mui/icons-material/PushPin";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import t from "../../i18n/Translations";
import {
  type Pinned,
  adjacentToTabContainerAfter,
  adjacentToTabContainerBefore,
} from "../../model/TabContainer";
import type { WindowId } from "../../model/Window";
import { WindowsContext } from "../contexts/WindowsContext";
import { PinnedActionMenu } from "./ActionMenu";

type PinnedContainerProps = {
  children: React.ReactNode;
  pinned: Pinned;
  collapsed: boolean;
  toggleCollapsed: () => void;
  data: {
    type: "window" | "tabGroup" | "pinned" | "tab";
    parentType: "window" | "tabGroup" | "pinned";
    windowId: WindowId;
  };
};

const PinnedContainer = (props: PinnedContainerProps) => {
  const { children, pinned, collapsed, toggleCollapsed, data } = props;
  const { windows } = useContext(WindowsContext);
  const { over, setNodeRef } = useDroppable({
    id: pinned.id,
    data: {
      ...data,
      collapsed,
    },
  });
  const isOver = over && over.id === pinned.id;

  const adjacentToTabContainerAbove = adjacentToTabContainerBefore(
    windows,
    pinned.id,
  );
  const adjacentToTabContainerBelow = adjacentToTabContainerAfter(
    windows,
    pinned.id,
  );

  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickPinnedActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);

  return (
    <Stack ref={setNodeRef} direction="row">
      <Box
        sx={{
          borderColor: "primary.main",
          borderRadius: `0 ${adjacentToTabContainerAbove ? "0" : "5px"} ${
            adjacentToTabContainerBelow ? "0" : "5px"
          } 0`,
          borderRightWidth: "5px",
          borderRightStyle: "solid",
        }}
      />
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <Stack>
          <ListItem
            sx={{
              bgcolor: isOver ? "primary.main" : undefined,
            }}
            secondaryAction={
              <Stack direction="row">
                {isHovered && (
                  <>
                    <IconButton edge="start" onClick={onClickPinnedActionMenu}>
                      <MoreVertIcon />
                    </IconButton>
                    <Divider orientation="vertical" variant="middle" flexItem />
                  </>
                )}
                <IconButton edge="end" onClick={toggleCollapsed}>
                  {collapsed ? <ExpandMore /> : <ExpandLess />}
                </IconButton>
              </Stack>
            }
            disablePadding
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ListItemButton onClick={toggleCollapsed}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PushPin fontSize="small" />
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="h6">
                      {t.pinned}
                    </Typography>
                  }
                />
                <Chip
                  label={pinned.children.length}
                  size="small"
                  color="primary"
                />
              </Stack>
            </ListItemButton>
            <PinnedActionMenu
              pinned={pinned}
              isOpenMenu={Boolean(menuAnchorElement)}
              anchorElement={menuAnchorElement}
              onCloseMenu={onCloseMenu}
            />
          </ListItem>
        </Stack>
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <List disablePadding>{children}</List>
        </Collapse>
      </List>
    </Stack>
  );
};

export default PinnedContainer;
