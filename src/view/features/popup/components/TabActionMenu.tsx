/* eslint @typescript-eslint/no-misused-promises: 0 */

import BookmarkIcon from "@mui/icons-material/Bookmark";
import LinkIcon from "@mui/icons-material/Link";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PushPinIcon from "@mui/icons-material/PushPin";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import { Tab } from "../../../../model/Tab";
import {
  bookmarkTab,
  screenshotVisibleArea,
} from "../../../../repository/TabsRepository";
import { usePinTab } from "../hooks/usePinTab";

type TabActionMenuProps = {
  tab: Tab;
  isOpenMenu: boolean;
  anchorPostion: AnchorPosition;
  onCloseMenu: () => void;
  onMenuActionCompleted: () => void;
};
type AnchorPosition = { top: number; left: number } | null;
type ActionMenu = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

const TabActionMenu = (props: TabActionMenuProps) => {
  const { tab, isOpenMenu, anchorPostion, onCloseMenu, onMenuActionCompleted } =
    props;
  const pinTab = usePinTab();

  const menus: ActionMenu[] = [
    {
      label: "Copy URL",
      icon: <LinkIcon fontSize="small" />,
      action: () => navigator.clipboard.writeText(tab.url),
    },
    {
      label: "Bookmark",
      icon: <BookmarkIcon fontSize="small" />,
      action: () => bookmarkTab(tab.title, tab.url),
    },
    {
      label: "Pin",
      icon: <PushPinIcon fontSize="small" />,
      action: () => pinTab(tab),
    },
  ];
  if (tab.isFocused) {
    menus.push({
      label: "Screenshot Visible Area",
      icon: <PhotoCameraIcon fontSize="small" />,
      action: () => {
        screenshotVisibleArea(tab.windowId, (dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${tab.title}.png`;
          link.click();
          link.remove();
        });
      },
    });
  }
  const onClickMenu = (action: () => void) => {
    action();
    onCloseMenu();
    onMenuActionCompleted();
  };

  return (
    <Menu
      id={`tab-action-menu-${tab.id.value}`}
      open={isOpenMenu}
      onClose={onCloseMenu}
      anchorReference="anchorPosition"
      anchorPosition={anchorPostion}
    >
      {menus.map((menu) => (
        <MenuItem
          key={menu.label}
          onClick={() => onClickMenu(menu.action)}
          style={{ minHeight: "24px" }}
        >
          <ListItemIcon>{menu.icon}</ListItemIcon>
          <ListItemText>{menu.label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default TabActionMenu;
