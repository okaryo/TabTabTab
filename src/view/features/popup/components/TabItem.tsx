import Clear from "@mui/icons-material/Clear";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";

import t from "../../../../i18n/Translations";
import { Tab } from "../../../../model/Tab";
import { focusTab } from "../../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";
import { useCloseTab } from "../hooks/useCloseTab";

import TabActionMenu from "./TabActionMenu";
import TabFavicon from "./TabFavicon";

type TabItemProps = {
  tab: Tab;
  sx?: SxProps;
};
type AnchorPosition = { top: number; left: number } | null;

const TabItem = (props: TabItemProps) => {
  const { tab, sx } = props;
  const { windows } = useContext(WindowsContext);
  const onTapTabItem = () => focusTab(tab.id);
  const [isHovered, setIsHovered] = React.useState(false);
  const shouldShowCloseButton = tab.isFocused || isHovered;

  const elapsedTimeSinceLastActiveText = (): string => {
    const duration = tab.durationSinceLastActivatedAt;
    if (duration.inDays >= 30) {
      const elapsedMonths = Math.floor(duration.inDays / 30);
      return t.elapsedTime(
        elapsedMonths,
        elapsedMonths === 1 ? t.month : t.months
      );
    }
    if (duration.inDays >= 7) {
      const elapsedWeeks = Math.floor(duration.inDays / 7);
      return t.elapsedTime(elapsedWeeks, elapsedWeeks === 1 ? t.week : t.weeks);
    }
    if (duration.inDays >= 1) {
      return t.elapsedTime(
        duration.inDays,
        duration.inDays === 1 ? t.day : t.days
      );
    }
    if (duration.inHours >= 1) {
      return t.elapsedTime(
        duration.inHours,
        duration.inHours === 1 ? t.hour : t.hours
      );
    }
    if (duration.inMinutes >= 1) {
      return t.elapsedTime(
        duration.inMinutes,
        duration.inMinutes === 1 ? t.min : t.mins
      );
    }
    if (duration.inSeconds >= 1) {
      return t.elapsedTime(
        duration.inSeconds,
        duration.inSeconds === 1 ? t.sec : t.secs
      );
    }

    return "";
  };
  const elapsedTimeText = elapsedTimeSinceLastActiveText();

  const closeTab = useCloseTab();
  const onClickDeleteButton = () => closeTab(tab.id);

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
                  label={t.duplicated}
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
              {elapsedTimeText !== "" && <span>・</span>}
              {elapsedTimeText !== "" && (
                <span style={{ whiteSpace: "nowrap" }}>{elapsedTimeText}</span>
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
