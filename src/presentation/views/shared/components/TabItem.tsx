import CircleIcon from "@mui/icons-material/Circle";
import Clear from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPin from "@mui/icons-material/PushPin";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";
import { useTheme } from "@mui/material/styles";
import { forwardRef, useContext, useState } from "react";
import { closeTab, focusTab } from "../../../../data/repository/TabsRepository";
import t from "../../../../i18n/Translations";
import { type Tab, durationSinceLastActivatedAt } from "../../../../model/Tab";
import {
  type TabContainer,
  isPinned,
  isTabGroup,
} from "../../../../model/TabContainer";
import {
  type Window,
  findParentContainer,
  findTabGroup,
  hasDuplicatedTabs,
} from "../../../../model/Window";
import { WindowsContext } from "../../../contexts/WindowsContext";
import resolveDuplicatedTabs from "../../../functions/resolveDuplicatedTabs";
import { TabItemActionMenu } from "./ActionMenu";
import TabFavicon from "./TabFavicon";

type TabItemProps = {
  tab: Tab;
  selected?: boolean;
  cursorGrabbing?: boolean;
  showDragIndicatorIcon?: boolean;
  showActions?: boolean;
  showDuplicatedChip?: boolean;
  showBelongingContainer?: boolean;
};
type BelongingTabContainerProps = {
  tab: Tab;
  windows: Window[];
};

const BelongingTabContainer = (props: BelongingTabContainerProps) => {
  const theme = useTheme();
  const { tab, windows } = props;
  const container = findParentContainer(windows, tab.id);

  if (isPinned(container as TabContainer)) {
    return (
      <>
        <PushPin sx={{ fontSize: theme.spacing(1.5) }} />
        <span>{t.pinned}</span>
      </>
    );
  }

  if (isTabGroup(container as TabContainer)) {
    const group = findTabGroup(tab.groupId, windows);
    return (
      <>
        <CircleIcon
          sx={{
            color: theme.palette.tabGroup[group.color],
            fontSize: theme.spacing(1),
          }}
        />
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {group.name}
        </span>
      </>
    );
  }

  return;
};

const TabItem = forwardRef<HTMLLIElement, TabItemProps>((props, ref) => {
  const {
    tab,
    selected,
    cursorGrabbing = false,
    showDragIndicatorIcon = true,
    showActions = true,
    showDuplicatedChip = true,
    showBelongingContainer = false,
  } = props;
  const { windows } = useContext(WindowsContext);
  const onTapTabItem = () => focusTab(tab);
  const [isHovered, setIsHovered] = useState(false);
  const shouldShowActions = showActions && (tab.active || isHovered);

  const elapsedTimeSinceLastActiveText = (): string => {
    if (!tab.lastActivatedAt) return "";

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
    if (duration.inSeconds >= 0) {
      return t.elapsedTime(
        duration.inSeconds,
        duration.inSeconds === 1 ? t.sec : t.secs,
      );
    }

    return "";
  };
  const elapsedTimeText = elapsedTimeSinceLastActiveText();

  const onClickDeleteButton = () => closeTab(tab.id);

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickTabActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);

  const [isDuplicatedChipHovered, setIsDuplicatedChipHovered] = useState(false);
  const onClickResolveDuplicatesChip = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    resolveDuplicatedTabs(windows, tab);
    setIsDuplicatedChipHovered(false);
  };

  return (
    <ListItem
      ref={ref}
      sx={{
        "& .MuiListItemButton-root": {
          pr: shouldShowActions ? 11 : null,
        },
        bgcolor: "background.paper",
      }}
      secondaryAction={
        shouldShowActions && (
          <Stack direction="row">
            <IconButton edge="start" onClick={onClickTabActionMenu}>
              <MoreVertIcon />
            </IconButton>
            <Divider orientation="vertical" variant="middle" flexItem />
            <IconButton edge="end" onClick={onClickDeleteButton}>
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
        sx={{ width: "100%", py: 0 }}
        style={{ cursor: cursorGrabbing ? "inherit" : "pointer" }}
        selected={tab.active || selected}
        onClick={onTapTabItem}
      >
        {showDragIndicatorIcon && isHovered && (
          <DragIndicatorIcon
            sx={{ color: grey[400] }}
            style={{
              position: "absolute",
              left: 0,
            }}
          />
        )}
        <TabFavicon
          key={`${tab.id}${tab.favIconUrl?.href}`}
          url={tab.favIconUrl}
          style={{ marginRight: "20px", flexShrink: 0 }}
          discarded={tab.discarded}
          isLoading={tab.status === "loading" && tab.url.protocol !== "chrome:"}
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
              {showDuplicatedChip && hasDuplicatedTabs(windows, tab) && (
                <Chip
                  label={
                    isDuplicatedChipHovered ? t.resolveDuplicates : t.duplicated
                  }
                  size="small"
                  variant="outlined"
                  color="warning"
                  component="span"
                  onMouseEnter={() => setIsDuplicatedChipHovered(true)}
                  onMouseLeave={() => setIsDuplicatedChipHovered(false)}
                  onClick={onClickResolveDuplicatesChip}
                  clickable
                />
              )}
            </Typography>
          }
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              {showBelongingContainer && (
                <>
                  <BelongingTabContainer tab={tab} windows={windows} />
                  <span>•</span>
                </>
              )}
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tab.url.host}
              </span>
              {elapsedTimeText !== "" && <span>•</span>}
              {elapsedTimeText !== "" && (
                <span style={{ whiteSpace: "nowrap" }}>{elapsedTimeText}</span>
              )}
            </Stack>
          }
        />
      </ListItemButton>
      <TabItemActionMenu
        tab={tab}
        isOpenMenu={Boolean(menuAnchorElement)}
        anchorElement={menuAnchorElement}
        onCloseMenu={onCloseMenu}
      />
    </ListItem>
  );
});

export default TabItem;
