import Clear from "@mui/icons-material/Clear";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import PushPin from "@mui/icons-material/PushPin";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  restorePinned,
  restoreTabGroup,
} from "../../../data/repository/TabGroupRepository";
import t from "../../../i18n/Translations";
import {
  type StoredTabContainer,
  adjacentToStoredTabContainerAfter,
  adjacentToStoredTabContainerBefore,
  isStoredPinned,
  isStoredTabGroup,
} from "../../../model/TabContainer";
import type { StoredWindow } from "../../../model/Window";
import { StoredTabItem } from "./StoredTabItem";

type StoredTabItemContainerProps = {
  window: StoredWindow;
  container: StoredTabContainer;
  onDeleteItem: (windowId: string, itemId: string) => void;
};

export const StoredTabItemContainer = (props: StoredTabItemContainerProps) => {
  const { window, container, onDeleteItem } = props;

  const theme = useTheme();
  const isPinned = isStoredPinned(container);
  const isTabGroup = isStoredTabGroup(container);

  const adjacentToTabContainerAbove = adjacentToStoredTabContainerBefore(
    window,
    container.internalUid,
  );
  const adjacentToTabContainerBelow = adjacentToStoredTabContainerAfter(
    window,
    container.internalUid,
  );
  const borderColor = isTabGroup
    ? theme.palette.tabGroup[container.color]
    : "primary.main";

  const [isHoveredHeader, setIsHoveredHeader] = useState(false);
  const [containerOpened, setContainerOpened] = useState(false);

  const toggleContainerOpened = () => setContainerOpened(!containerOpened);
  const onClickContainerOpenIcon = () => {
    if (isPinned) restorePinned(container);
    if (isTabGroup) restoreTabGroup(container);
  };

  return (
    <Stack direction="row">
      <Box
        sx={{
          borderColor: borderColor,
          borderRadius: `0 ${adjacentToTabContainerAbove ? "0" : "5px"} ${
            adjacentToTabContainerBelow ? "0" : "5px"
          } 0`,
          borderRightWidth: "5px",
          borderRightStyle: "solid",
        }}
      />
      <Stack sx={{ width: "calc(100% - 5px)" }}>
        <ListItem
          onMouseEnter={() => setIsHoveredHeader(true)}
          onMouseLeave={() => setIsHoveredHeader(false)}
          secondaryAction={
            <Stack direction="row">
              {isHoveredHeader && (
                <>
                  <IconButton onClick={onClickContainerOpenIcon}>
                    <OpenInBrowserIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      onDeleteItem(window.internalUid, container.internalUid)
                    }
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                  <Divider orientation="vertical" variant="middle" flexItem />
                </>
              )}
              <IconButton edge="end" onClick={toggleContainerOpened}>
                {containerOpened ? (
                  <ExpandMore fontSize="small" />
                ) : (
                  <ExpandLess fontSize="small" />
                )}
              </IconButton>
            </Stack>
          }
          disablePadding
        >
          <ListItemButton onClick={toggleContainerOpened}>
            <ListItemText
              primary={
                <Stack direction="row" alignItems="center" spacing={1}>
                  {isPinned && <PushPin sx={{ fontSize: 16 }} />}
                  <Typography
                    variant="subtitle2"
                    component="p"
                    sx={{
                      px: isTabGroup ? 1 : 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    style={{
                      display: "inline-block",
                      borderRadius: "4px",
                      backgroundColor: isTabGroup
                        ? theme.palette.tabGroup[container.color]
                        : undefined,
                      color: isTabGroup
                        ? theme.palette.getContrastText(
                            theme.palette.tabGroup[container.color],
                          )
                        : undefined,
                    }}
                  >
                    {isTabGroup ? container.name : t.pinned}
                  </Typography>
                  <Chip
                    label={container.children.length}
                    size="small"
                    color={isPinned ? "primary" : undefined}
                    sx={{
                      height: 18,
                      backgroundColor: isTabGroup
                        ? theme.palette.tabGroup[container.color]
                        : undefined,
                      color: isTabGroup
                        ? theme.palette.getContrastText(
                            theme.palette.tabGroup[container.color],
                          )
                        : undefined,
                    }}
                  />
                </Stack>
              }
            />
          </ListItemButton>
        </ListItem>
        <Collapse in={containerOpened} timeout="auto" unmountOnExit>
          {container.children.map((tab) => (
            <StoredTabItem
              key={tab.internalUid}
              tab={tab}
              onDeleteItem={() =>
                onDeleteItem(window.internalUid, tab.internalUid)
              }
            />
          ))}
        </Collapse>
      </Stack>
    </Stack>
  );
};
