/* eslint @typescript-eslint/no-misused-promises: 0 */

import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CropFreeIcon from "@mui/icons-material/CropFree";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputIcon from "@mui/icons-material/Input";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PushPinIcon from "@mui/icons-material/PushPin";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import t from "../../i18n/Translations";
import { Tab } from "../../model/Tab";
import { Pinned, TabGroup } from "../../model/TabContainer";
import { Window } from "../../model/Window";
import { screenshotVisibleArea } from "../../repository/TabsRepository";
import { useCloseWindow } from "../features/options/hooks/useCloseWindow";
import { useAddTabToNewGroup } from "../hooks/useAddTabToNewGroup";
import { useCloseAllTabs } from "../hooks/useCloseAllTabs";
import { useCloseTabGroup } from "../hooks/useCloseTabGroup";
import { useMergeWindow } from "../hooks/useMergeWindow";
import { usePinTab } from "../hooks/usePinTab";
import { useRemoveFromTabGroup } from "../hooks/useRemoveFromTabGroup";
import { useUngroup } from "../hooks/useUngroup";
import { useUnpinAllTabs } from "../hooks/useUnpinAllTabs";
import { useUnpinTab } from "../hooks/useUnpinTab";

type ActionMenuItemAttrs =
  | {
      type: "Divider";
    }
  | {
      type: "MenuItem";
      label: string;
      icon: React.ReactNode;
      action: () => void;
    };
type ActionMenuProps = {
  items: ActionMenuItemAttrs[];
  isOpenMenu: boolean;
  anchorElement: HTMLElement;
  onCloseMenu: () => void;
};
type TabItemActionMenuProps = Omit<ActionMenuProps, "items"> & {
  tab: Tab;
};
type PinnedActionMenuProps = Omit<ActionMenuProps, "items"> & {
  pinned: Pinned;
};
type TabGroupActionMenuProps = Omit<ActionMenuProps, "items"> & {
  tabGroup: TabGroup;
};
type WindowActionMenuProps = Omit<ActionMenuProps, "items"> & {
  windows: Window[];
  currentIndex: number;
};
type ActionMenuItemProps = {
  label: string;
  icon: React.ReactNode;
  onClickMenu: () => void;
};

const ActionMenuItem = (props: ActionMenuItemProps) => {
  const { label, icon, onClickMenu } = props;

  return (
    <MenuItem onClick={onClickMenu} style={{ minHeight: "24px" }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{label}</ListItemText>
    </MenuItem>
  );
};

export const TabItemActionMenu = (props: TabItemActionMenuProps) => {
  const { tab, isOpenMenu, anchorElement, onCloseMenu } = props;

  const pinTab = usePinTab();
  const unpinTab = useUnpinTab();
  const addTabToNewGroup = useAddTabToNewGroup();
  const removeFromTabGroup = useRemoveFromTabGroup();
  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.copyUrl,
      icon: <ContentCopyIcon fontSize="small" />,
      action: () => navigator.clipboard.writeText(tab.url.href),
    },
    tab.pinned && {
      type: "MenuItem",
      label: t.unpin,
      icon: <PushPinIcon fontSize="small" />,
      action: () => unpinTab(tab.id),
    },
    !tab.pinned && {
      type: "MenuItem",
      label: t.pin,
      icon: <PushPinIcon fontSize="small" />,
      action: () => pinTab(tab.id),
    },
    tab.groupId && {
      type: "MenuItem",
      label: t.removeFromGroup,
      icon: <CropFreeIcon fontSize="small" />,
      action: () => removeFromTabGroup(tab.id),
    },
    !tab.groupId && {
      type: "MenuItem",
      label: t.addToNewGroup,
      icon: <LibraryAddIcon fontSize="small" />,
      action: () => addTabToNewGroup(tab.id, tab.windowId),
    },
    tab.highlighted && {
      type: "Divider",
    },
    tab.highlighted && {
      type: "MenuItem",
      label: t.screenshotVisibleArea,
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
    },
  ];

  return (
    <ActionMenu
      items={items}
      isOpenMenu={isOpenMenu}
      anchorElement={anchorElement}
      onCloseMenu={onCloseMenu}
    />
  );
};

export const PinnedActionMenu = (props: PinnedActionMenuProps) => {
  const { pinned, isOpenMenu, anchorElement, onCloseMenu } = props;

  const unpinAllTabs = useUnpinAllTabs();
  const closeAllTabs = useCloseAllTabs();
  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.unpinAll,
      icon: <PushPinIcon fontSize="small" />,
      action: () => unpinAllTabs(pinned.children),
    },
    {
      type: "MenuItem",
      label: t.closeAll,
      icon: <HighlightOffIcon fontSize="small" />,
      action: () => closeAllTabs(pinned.children),
    },
  ];

  return (
    <ActionMenu
      items={items}
      isOpenMenu={isOpenMenu}
      anchorElement={anchorElement}
      onCloseMenu={onCloseMenu}
    />
  );
};

export const TabGroupActionMenu = (props: TabGroupActionMenuProps) => {
  const { tabGroup, isOpenMenu, anchorElement, onCloseMenu } = props;

  const ungroup = useUngroup();
  const closeTabGroup = useCloseTabGroup();
  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.ungroup,
      icon: <CropFreeIcon fontSize="small" />,
      action: () => ungroup(tabGroup),
    },
    {
      type: "MenuItem",
      label: t.closeGroup,
      icon: <HighlightOffIcon fontSize="small" />,
      action: () => closeTabGroup(tabGroup),
    },
  ];

  return (
    <ActionMenu
      items={items}
      isOpenMenu={isOpenMenu}
      anchorElement={anchorElement}
      onCloseMenu={onCloseMenu}
    />
  );
};

export const WindowActionMenu = (props: WindowActionMenuProps) => {
  const { windows, currentIndex, isOpenMenu, anchorElement, onCloseMenu } =
    props;
  const window = windows[currentIndex];
  const isFirstWindow = currentIndex === 0;
  const isLastWindow = currentIndex === windows.length - 1;

  const mergeWindow = useMergeWindow();

  const closeWindow = useCloseWindow();
  const items: ActionMenuItemAttrs[] = [
    !isLastWindow && {
      type: "MenuItem",
      label: t.mergeRightWindow,
      icon: <InputIcon fontSize="small" sx={{ transform: "scaleX(-1)" }} />,
      action: () => mergeWindow(window.id, windows[currentIndex + 1]),
    },
    !isFirstWindow && {
      type: "MenuItem",
      label: t.mergeLeftWindow,
      icon: <InputIcon fontSize="small" />,
      action: () => mergeWindow(window.id, windows[currentIndex - 1]),
    },
    windows.length > 1 && {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.closeWindow,
      icon: <CancelPresentationIcon fontSize="small" />,
      action: () => closeWindow(window.id),
    },
  ];

  return (
    <ActionMenu
      items={items}
      isOpenMenu={isOpenMenu}
      anchorElement={anchorElement}
      onCloseMenu={onCloseMenu}
    />
  );
};

const ActionMenu = (props: ActionMenuProps) => {
  const { items, isOpenMenu, anchorElement, onCloseMenu } = props;

  const onClickMenu = (action: () => void) => {
    action();
    onCloseMenu();
  };

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
      {items.filter(Boolean).map((item, index) => {
        if (item.type === "Divider") return <Divider key={index} />;

        return (
          <ActionMenuItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            onClickMenu={() => onClickMenu(item.action)}
          />
        );
      })}
    </Menu>
  );
};
