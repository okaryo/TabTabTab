import Clear from "@mui/icons-material/Clear";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";

import { Tab } from "../../../model/Tab";
import { removeTab } from "../../../repository/TabsRepository";
import { focusTab } from "../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";

import TabActionMenu from "./TabActionMenu";
import TabFavicon from "./TabFavicon";

type TabItemProps = {
  tab: Tab;
  sx?: SxProps;
};
type AnchorPosition = { top: number; left: number } | null;

const TabItem = (props: TabItemProps) => {
  const { tab, sx } = props;
  const { windows, setWindows } = useContext(WindowsContext);
  const onTapTabItem = () => focusTab(tab.id);
  const [isHovered, setIsHovered] = React.useState(false);
  const shouldShowCloseButton = tab.isFocused || isHovered;

  let sinceLastActivatedAt = "";
  const milliSecondsSinceLastActivatedAt = tab.milliSecondsSinceLastActivatedAt;
  if (milliSecondsSinceLastActivatedAt !== null) {
    let difference: number;
    let unit: string;
    if (milliSecondsSinceLastActivatedAt < 60 * 1000) {
      difference = Math.floor(milliSecondsSinceLastActivatedAt / 1000);
      unit = "secs ago";
      if (difference === 0 || difference === 1) unit = "sec ago";
    } else if (milliSecondsSinceLastActivatedAt < 60 * 60 * 1000) {
      difference = Math.floor(milliSecondsSinceLastActivatedAt / (60 * 1000));
      unit = "mins ago";
      if (difference === 1) unit = "min ago";
    } else if (milliSecondsSinceLastActivatedAt < 24 * 60 * 60 * 1000) {
      difference = Math.floor(
        milliSecondsSinceLastActivatedAt / (60 * 60 * 1000)
      );
      unit = "hours ago";
      if (difference === 1) unit = "hour ago";
    } else if (milliSecondsSinceLastActivatedAt < 7 * 24 * 60 * 60 * 10000) {
      difference = Math.floor(
        milliSecondsSinceLastActivatedAt / (24 * 60 * 60 * 1000)
      );
      unit = "days ago";
      if (difference === 1) unit = "day ago";
    } else if (milliSecondsSinceLastActivatedAt < 30 * 24 * 60 * 60 * 10000) {
      difference = Math.floor(
        milliSecondsSinceLastActivatedAt / (7 * 24 * 60 * 60 * 1000)
      );
      unit = "weeks ago";
      if (difference === 1) unit = "week ago";
    } else {
      difference = Math.floor(
        milliSecondsSinceLastActivatedAt / (30 * 7 * 24 * 60 * 60 * 1000)
      );
      unit = "months ago";
      if (difference === 1) unit = "month ago";
    }

    sinceLastActivatedAt = `${difference} ${unit}`;
  }

  const onClickDeleteButton = async () => {
    await removeTab(tab.id);
    const newWindows = windows.removeTabBy(tab.id);
    setWindows(newWindows);
  };

  const [menuAnchorPosition, setMenuAnchorPosition] =
    useState<AnchorPosition | null>(null);
  const [isMenuActionCompleted, setIsMenuActionCompleted] = useState(false);
  useEffect(() => {
    if (isMenuActionCompleted) {
      const timer = setTimeout(() => {
        setIsMenuActionCompleted(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isMenuActionCompleted]);
  const onRightClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setMenuAnchorPosition({ top: event.clientY, left: event.clientX });
  };
  const onCloseMenu = () => setMenuAnchorPosition(null);
  const onMenuActionCompleted = () => setIsMenuActionCompleted(true);

  return (
    <ListItem
      secondaryAction={
        shouldShowCloseButton && (
          <IconButton
            edge="end"
            aria-label="delete"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={onClickDeleteButton}
          >
            <Clear />
          </IconButton>
        )
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={onRightClick}
      disablePadding
    >
      <ListItemButton
        sx={{ width: "100%", pt: 0, pb: 0, ...sx }}
        color="info"
        selected={tab.isFocused}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={onTapTabItem}
      >
        <TabFavicon
          url={tab.favIconUrl}
          shouldShowCheckIcon={isMenuActionCompleted}
          style={{ marginRight: "20px" }}
        />
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              component="p"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                letterSpacing: 0,
                fontSize: 14,
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {tab.title}
              </span>
              {tab.hasDuplicatedTabs(windows) && (
                <Chip
                  label="Duplicated"
                  size="small"
                  variant="outlined"
                  color="warning"
                  component="span"
                />
              )}
            </Typography>
          }
          secondary={
            <span style={{ display: "flex" }}>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tab.originUrl}
              </span>
              {sinceLastActivatedAt !== "" && <span>・</span>}
              {sinceLastActivatedAt !== "" && (
                <span style={{ whiteSpace: "nowrap" }}>
                  {sinceLastActivatedAt}
                </span>
              )}
            </span>
          }
        />
      </ListItemButton>
      <TabActionMenu
        tab={tab}
        isOpenMenu={Boolean(menuAnchorPosition)}
        anchorPostion={menuAnchorPosition}
        onCloseMenu={onCloseMenu}
        onMenuActionCompleted={onMenuActionCompleted}
      />
    </ListItem>
  );
};

export default TabItem;
