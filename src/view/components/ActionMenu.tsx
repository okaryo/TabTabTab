import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import CropFreeIcon from "@mui/icons-material/CropFree";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputIcon from "@mui/icons-material/Input";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PushPinIcon from "@mui/icons-material/PushPin";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SyncIcon from "@mui/icons-material/Sync";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon from "@mui/material/SvgIcon";
import type React from "react";
import {
  navigateToOptionsPage,
  openSidePanel,
} from "../../data/repository/SettingsRepository";
import {
  closeTabGroup,
  saveTabGroup,
  ungroup,
} from "../../data/repository/TabGroupRepository";
import {
  addTabToNewGroup,
  closeTabs,
  createNewTabNext,
  duplicateTab,
  pinTab,
  removeFromGroup,
  screenshotVisibleArea,
  unpinAllTabs,
  unpinTab,
} from "../../data/repository/TabsRepository";
import {
  closeWindow,
  saveWindow,
} from "../../data/repository/WindowsRepository";
import t from "../../i18n/Translations";
import type { Tab } from "../../model/Tab";
import type { Pinned, TabGroup } from "../../model/TabContainer";
import type { Window } from "../../model/Window";
import { mergeWindow } from "../functions/mergeWindow";

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

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.addNewTabNext,
      icon: <ControlPointIcon fontSize="small" />,
      action: () => createNewTabNext(tab.id),
    },
    tab.groupId && {
      type: "MenuItem",
      label: t.removeFromGroup,
      icon: <CropFreeIcon fontSize="small" />,
      action: () => removeFromGroup(tab.id),
    },
    !tab.groupId && {
      type: "MenuItem",
      label: t.addToNewGroup,
      icon: <LibraryAddIcon fontSize="small" />,
      action: () => addTabToNewGroup(tab.id, tab.windowId),
    },
    {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.copyUrl,
      icon: <ContentCopyIcon fontSize="small" />,
      action: () => navigator.clipboard.writeText(tab.url.href),
    },
    {
      type: "MenuItem",
      label: t.duplicateTab,
      icon: <ControlPointDuplicateIcon fontSize="small" />,
      action: () => duplicateTab(tab.id),
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
    tab.active && {
      type: "Divider",
    },
    tab.active && {
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

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.unpinAll,
      icon: <PushPinIcon fontSize="small" />,
      action: () => unpinAllTabs(pinned.children),
    },
    {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.closeAll,
      icon: <HighlightOffIcon fontSize="small" />,
      action: () => closeTabs(pinned.children.map((tab) => tab.id)),
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

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.saveTabGroup,
      icon: <SyncIcon fontSize="small" />,
      action: () => saveTabGroup(tabGroup),
    },
    {
      type: "MenuItem",
      label: t.ungroup,
      icon: <CropFreeIcon fontSize="small" />,
      action: () => ungroup(tabGroup),
    },
    {
      type: "Divider",
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

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.saveWindow,
      icon: <SyncIcon fontSize="small" />,
      action: () => saveWindow(window),
    },
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
    {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.closeWindow,
      icon: <CancelPresentationIcon fontSize="small" />,
      action: () => closeWindow(window),
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

type PopupHeaderActionMenuProps = Omit<ActionMenuProps, "items">;
export const PopupHeaderActionMenu = (props: PopupHeaderActionMenuProps) => {
  const { isOpenMenu, anchorElement, onCloseMenu } = props;

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.openSidePanel,
      icon: (
        <SvgIcon fontSize="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="SidePanel"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="currentColor"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm360-80v-560H200v560h360Z" />
          </svg>
        </SvgIcon>
      ),
      action: async () => {
        await openSidePanel();
        window.close();
      },
    },
    {
      type: "MenuItem",
      label: t.openDashboard,
      icon: <SpaceDashboardIcon fontSize="small" />,
      action: () => navigateToOptionsPage(),
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
        if (item.type === "Divider") {
          return <Divider key={`${item.type}${index}`} />;
        }

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
