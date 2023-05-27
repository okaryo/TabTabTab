import React, { ReactElement } from "react";
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  SxProps,
  Typography,
} from "@mui/material";
import TabIcon from "@mui/icons-material/Tab";
import Clear from "@mui/icons-material/Clear";
import { TbWindows } from "../../model/Windows";
import { Tab } from "../../model/Tab";
import { TabId } from "../../model/TabId";
import { focusTab } from "../../repository/TabsRepository";

type TabItemProps = {
  windows: TbWindows;
  tab: Tab;
  sx?: SxProps;
  onRemoveTab: (tabId: TabId) => Promise<void>;
};

const TabItem = (props: TabItemProps) => {
  const { windows, tab, sx, onRemoveTab } = props;
  const onTapTabItem = (): Promise<void> => focusTab(tab.id);

  let favIcon: ReactElement;
  const favIconUrl = tab.favIconUrl;
  if (
    favIconUrl !== undefined &&
    (favIconUrl.startsWith("https") || favIconUrl.startsWith("http"))
  ) {
    favIcon = (
      <Box
        component="img"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
        src={favIconUrl}
      />
    );
  } else {
    favIcon = (
      <TabIcon
        color="disabled"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
      />
    );
  }

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

  const onClickDeleteButton = () => onRemoveTab(tab.id);

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={onClickDeleteButton}
        >
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        sx={{ width: 400, pt: 0, pb: 0, ...sx }}
        color="info"
        selected={tab.isFocused}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={onTapTabItem}
      >
        {favIcon}
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
    </ListItem>
  );
};

export default TabItem;
