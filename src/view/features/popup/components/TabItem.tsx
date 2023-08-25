import Clear from "@mui/icons-material/Clear";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { forwardRef, useContext, useEffect, useState } from "react";

import t from "../../../../i18n/Translations";
import { Tab, durationSinceLastActivatedAt } from "../../../../model/Tab";
import { hasDuplicatedTabs } from "../../../../model/Window";
import { focusTab } from "../../../../repository/TabsRepository";
import { WindowsContext } from "../contexts/Windows";
import { useCloseTab } from "../hooks/useCloseTab";

import TabActionMenu from "./TabActionMenu";
import TabFavicon from "./TabFavicon";

type TabItemProps = {
  tab: Tab;
  selected?: boolean;
};

const TabItem = forwardRef<HTMLLIElement, TabItemProps>((props, ref) => {
  const { tab, selected } = props;
  const { windows } = useContext(WindowsContext);
  const onTapTabItem = () => focusTab(tab.id);
  const [isHovered, setIsHovered] = useState(false);
  const shouldShowCloseButton = tab.highlighted || isHovered;

  const elapsedTimeSinceLastActiveText = (): string => {
    const duration = durationSinceLastActivatedAt(tab);
    if (duration.inDays >= 30) {
      const elapsedMonths = Math.floor(duration.inDays / 30);
      return t.elapsedTime(
        elapsedMonths,
        elapsedMonths === 1 ? t.month : t.months,
      );
    }
    if (duration.inDays >= 7) {
      const elapsedWeeks = Math.floor(duration.inDays / 7);
      return t.elapsedTime(elapsedWeeks, elapsedWeeks === 1 ? t.week : t.weeks);
    }
    if (duration.inDays >= 1) {
      return t.elapsedTime(
        duration.inDays,
        duration.inDays === 1 ? t.day : t.days,
      );
    }
    if (duration.inHours >= 1) {
      return t.elapsedTime(
        duration.inHours,
        duration.inHours === 1 ? t.hour : t.hours,
      );
    }
    if (duration.inMinutes >= 1) {
      return t.elapsedTime(
        duration.inMinutes,
        duration.inMinutes === 1 ? t.min : t.mins,
      );
    }
    if (duration.inSeconds >= 1) {
      return t.elapsedTime(
        duration.inSeconds,
        duration.inSeconds === 1 ? t.sec : t.secs,
      );
    }

    return "";
  };
  const elapsedTimeText = elapsedTimeSinceLastActiveText();

  const closeTab = useCloseTab();
  const onClickDeleteButton = () => closeTab(tab.id);

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const [isMenuActionCompleted, setIsMenuActionCompleted] = useState(false);
  useEffect(() => {
    if (isMenuActionCompleted) {
      const timer = setTimeout(() => {
        setIsMenuActionCompleted(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isMenuActionCompleted]);
  const onClickTabActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);
  const onMenuActionCompleted = () => setIsMenuActionCompleted(true);

  return (
    <ListItem
      ref={ref}
      sx={{
        "& .MuiListItemButton-root": {
          pr: shouldShowCloseButton ? 11 : null,
        },
      }}
      secondaryAction={
        shouldShowCloseButton && (
          <Stack direction="row">
            <IconButton edge="start" onClick={onClickTabActionMenu}>
              <MoreVertIcon />
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconButton
              edge="end"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={onClickDeleteButton}
            >
              <Clear />
            </IconButton>
          </Stack>
        )
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disablePadding
    >
      <ListItemButton
        sx={{ width: "100%", pt: 0, pb: 0 }}
        color="info"
        selected={tab.highlighted || selected}
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
              variant="subtitle2"
              component="p"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                title={tab.title}
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {tab.title}
              </span>
              {tab.audible && <VolumeUpIcon fontSize="small" />}
              {hasDuplicatedTabs(windows, tab) && (
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
                {tab.url.origin}
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
        isOpenMenu={Boolean(menuAnchorElement)}
        anchorElement={menuAnchorElement}
        onCloseMenu={onCloseMenu}
        onMenuActionCompleted={onMenuActionCompleted}
      />
    </ListItem>
  );
});

export default TabItem;
