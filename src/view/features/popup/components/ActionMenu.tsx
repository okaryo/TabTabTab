/* eslint @typescript-eslint/no-misused-promises: 0 */

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CropFreeIcon from "@mui/icons-material/CropFree";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
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
  TabContainer,
  isPinned,
  isTab,
  isTabGroup,
} from "../../../../model/TabContainer";
import { screenshotVisibleArea } from "../../../../repository/TabsRepository";
import { useAddTabToNewGroup } from "../hooks/useAddTabToNewGroup";
import { useCloseAllTabs } from "../hooks/useCloseAllTabs";
import { useCloseTabGroup } from "../hooks/useCloseTabGroup";
import { usePinTab } from "../hooks/usePinTab";
import { useRemoveFromTabGroup } from "../hooks/useRemoteFromTabGroup";
import { useUngroup } from "../hooks/useUngroup";
import { useUnpinAllTabs } from "../hooks/useUnpinAllTabs";
import { useUnpinTab } from "../hooks/useUnpinTab";

type ActionMenuProps = {
  target: TabContainer | Tab;
  isOpenMenu: boolean;
  anchorElement: HTMLElement;
  onCloseMenu: () => void;
  onMenuActionCompleted?: () => void;
};
type ActionMenuItemProps = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  onClickMenu: (action: () => void) => void;
};

const ActionMenuItem = (props: ActionMenuItemProps) => {
  const { label, icon, action, onClickMenu } = props;

  return (
    <MenuItem onClick={() => onClickMenu(action)} style={{ minHeight: "24px" }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );
};

const ActionMenu = (props: ActionMenuProps) => {
  const {
    target,
    isOpenMenu,
    anchorElement,
    onCloseMenu,
    onMenuActionCompleted,
  } = props;
  const pinTab = usePinTab();
  const unpinTab = useUnpinTab();
  const unpinAllTabs = useUnpinAllTabs();
  const closeAllTabs = useCloseAllTabs();
  const ungroup = useUngroup();
  const closeTabGroup = useCloseTabGroup();
  const addTabToNewGroup = useAddTabToNewGroup();
  const removeFromTabGroup = useRemoveFromTabGroup();

  const onClickMenu = (action: () => void) => {
    action();
    onCloseMenu();
    if (onMenuActionCompleted) {
      onMenuActionCompleted();
    }
  };

  let menus: JSX.Element[];
  if (isTab(target)) {
    const tab = target;
    menus = [
      <ActionMenuItem
        key={t.copyUrl}
        label={t.copyUrl}
        icon={<ContentCopyIcon fontSize="small" />}
        action={() => navigator.clipboard.writeText(tab.url.href)}
        onClickMenu={onClickMenu}
      />,
      tab.pinned && (
        <ActionMenuItem
          key={t.unpin}
          label={t.unpin}
          icon={<PushPinIcon fontSize="small" />}
          action={() => unpinTab(tab.id)}
          onClickMenu={onClickMenu}
        />
      ),
      !tab.pinned && (
        <ActionMenuItem
          key={t.pin}
          label={t.pin}
          icon={<PushPinIcon fontSize="small" />}
          action={() => pinTab(tab.id)}
          onClickMenu={onClickMenu}
        />
      ),
      tab.groupId && (
        <ActionMenuItem
          key={t.removeFromGroup}
          label={t.removeFromGroup}
          icon={<CropFreeIcon fontSize="small" />}
          action={() => removeFromTabGroup(tab.id)}
          onClickMenu={onClickMenu}
        />
      ),
      !tab.groupId && (
        <ActionMenuItem
          key={t.addToNewGroup}
          label={t.addToNewGroup}
          icon={<LibraryAddIcon fontSize="small" />}
          action={() => addTabToNewGroup(tab.id)}
          onClickMenu={onClickMenu}
        />
      ),
      tab.highlighted && <Divider key="divider" />,
      tab.highlighted && (
        <ActionMenuItem
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
          onClickMenu={onClickMenu}
        />
      ),
    ];
  }
  if (isPinned(target)) {
    const pinned = target;
    menus = [
      <ActionMenuItem
        key={t.unpinAll}
        label={t.unpinAll}
        icon={<PushPinIcon fontSize="small" />}
        action={() => unpinAllTabs(pinned.children)}
        onClickMenu={onClickMenu}
      />,
      <ActionMenuItem
        key={t.closeAll}
        label={t.closeAll}
        icon={<HighlightOffIcon fontSize="small" />}
        action={() => closeAllTabs(pinned.children)}
        onClickMenu={onClickMenu}
      />,
    ];
  }
  if (isTabGroup(target)) {
    const tabGroup = target;
    menus = [
      <ActionMenuItem
        key={t.ungroup}
        label={t.ungroup}
        icon={<CropFreeIcon fontSize="small" />}
        action={() => ungroup(tabGroup)}
        onClickMenu={onClickMenu}
      />,
      <ActionMenuItem
        key={t.closeGroup}
        label={t.closeGroup}
        icon={<HighlightOffIcon fontSize="small" />}
        action={() => closeTabGroup(tabGroup)}
        onClickMenu={onClickMenu}
      />,
    ];
  }

  return (
    <Menu
      open={isOpenMenu}
      onClose={onCloseMenu}
      anchorEl={anchorElement}
      slotProps={{
        paper: () => {
          return {
            style: {
              maxHeight: "calc(100% - 24px)",
            },
          };
        },
      }}
      MenuListProps={{
        dense: true,
      }}
    >
      {menus}
    </Menu>
  );
};

export default ActionMenu;
