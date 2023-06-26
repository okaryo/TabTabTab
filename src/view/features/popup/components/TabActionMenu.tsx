/* eslint @typescript-eslint/no-misused-promises: 0 */

import BookmarkIcon from "@mui/icons-material/Bookmark";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PushPinIcon from "@mui/icons-material/PushPin";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import t from "../../../../i18n/Translations";
import { Tab } from "../../../../model/Tab";
import {
  bookmarkTab,
  screenshotVisibleArea,
} from "../../../../repository/TabsRepository";
import { usePinTab } from "../hooks/usePinTab";

type TabActionMenuProps = {
  tab: Tab;
  isOpenMenu: boolean;
  anchorElement: HTMLElement;
  onCloseMenu: () => void;
  onMenuActionCompleted: () => void;
};
type ActionMenuProps = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

const TabActionMenu = (props: TabActionMenuProps) => {
  const { tab, isOpenMenu, anchorElement, onCloseMenu, onMenuActionCompleted } =
    props;
  const pinTab = usePinTab();

  const ActionMenu = (props: ActionMenuProps) => {
    const { label, icon, action } = props;
    return (
      <MenuItem
        onClick={() => onClickMenu(action)}
        style={{ minHeight: "24px" }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MenuItem>
    );
  };

  const menus = [
    <ActionMenu
      key={t.copyUrl}
      label={t.copyUrl}
      icon={<ContentCopyIcon fontSize="small" />}
      action={() => navigator.clipboard.writeText(tab.url.href)}
    />,
    <ActionMenu
      key={t.bookmark}
      label={t.bookmark}
      icon={<BookmarkIcon fontSize="small" />}
      action={() => bookmarkTab(tab.title, tab.url.href)}
    />,
    <ActionMenu
      key={t.pin}
      label={t.pin}
      icon={<PushPinIcon fontSize="small" />}
      action={() => pinTab(tab)}
    />,
    tab.isFocused && <Divider key="divider" />,
    tab.isFocused && (
      <ActionMenu
        key={t.screenshotVisibleArea}
        label={t.screenshotVisibleArea}
        icon={<PhotoCameraIcon fontSize="small" />}
        action={() => {
          screenshotVisibleArea(tab.windowId, (dataUrl) => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${tab.title}.png`;
            link.click();
            link.remove();
          });
        }}
      />
    ),
  ];
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
      anchorEl={anchorElement}
    >
      {menus}
    </Menu>
  );
};

export default TabActionMenu;
