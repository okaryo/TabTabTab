import AddIcon from "@mui/icons-material/Add";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import CropFreeIcon from "@mui/icons-material/CropFree";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ForumIcon from "@mui/icons-material/Forum";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InputIcon from "@mui/icons-material/Input";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PushPinIcon from "@mui/icons-material/PushPin";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboard";
import SyncIcon from "@mui/icons-material/Sync";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
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
} from "../../../../data/repository/SettingsRepository";
import {
  closeTabGroup,
  saveTabGroup,
  ungroup,
} from "../../../../data/repository/TabGroupRepository";
import {
  addTabToNewGroup,
  closeTabs,
  createNewTab,
  createNewTabInGroup,
  createNewTabInWindow,
  createNewTabNext,
  duplicateTab,
  pinTab,
  removeFromGroup,
  screenshotVisibleArea,
  unpinAllTabs,
  unpinTab,
} from "../../../../data/repository/TabsRepository";
import {
  closeWindow,
  removeStoredWindow,
  restoreWindow,
  saveWindow,
  saveWindows,
} from "../../../../data/repository/WindowsRepository";
import t from "../../../../i18n/Translations";
import type { Tab } from "../../../../model/Tab";
import type { Pinned, TabGroup } from "../../../../model/TabContainer";
import type { StoredWindow, Window } from "../../../../model/Window";
import mergeWindow from "../../../functions/mergeWindow";

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
      label: t.addNewTabInGroup,
      icon: <ControlPointIcon fontSize="small" />,
      action: () => createNewTabInGroup(tabGroup.id),
    },
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
  const hasMultipleWindows = windows.length > 1;
  const hasWindowOnRightSide =
    hasMultipleWindows && currentIndex !== windows.length - 1;
  const hasWindowOnLeftSide = hasMultipleWindows && currentIndex !== 0;

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.addNewTabInWindow,
      icon: <ControlPointIcon fontSize="small" />,
      action: () => createNewTabInWindow(window.id),
    },
    {
      type: "MenuItem",
      label: t.saveWindow,
      icon: <SyncIcon fontSize="small" />,
      action: () => saveWindow(window),
    },
    hasMultipleWindows && {
      type: "MenuItem",
      label: t.saveAllWindows,
      icon: <SyncIcon fontSize="small" />,
      action: () => saveWindows(windows),
    },
    hasWindowOnRightSide && {
      type: "MenuItem",
      label: t.mergeRightWindow,
      icon: <InputIcon fontSize="small" sx={{ transform: "scaleX(-1)" }} />,
      action: () => mergeWindow(window.id, windows[currentIndex + 1]),
    },
    hasWindowOnLeftSide && {
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

type PopupHeaderActionMenuProps = Omit<ActionMenuProps, "items"> & {
  sidePanel: boolean;
};
export const PopupHeaderActionMenu = (props: PopupHeaderActionMenuProps) => {
  const { isOpenMenu, anchorElement, onCloseMenu, sidePanel } = props;

  const items: ActionMenuItemAttrs[] = [
    sidePanel && {
      type: "MenuItem",
      label: t.closeSidePanel,
      icon: (
        <SvgIcon fontSize="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="CloseSidePanel"
            height="24"
            width="24"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M300-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm360-80v-560H200v560h360Z" />
          </svg>
        </SvgIcon>
      ),
      action: async () => {
        await openSidePanel();
        window.close();
      },
    },
    !sidePanel && {
      type: "MenuItem",
      label: t.openSidePanel,
      icon: (
        <SvgIcon fontSize="small">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="OpenSidePanel"
            height="24"
            width="24"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M460-320v-320L300-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm360-80v-560H200v560h360Z" />
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
      icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
      action: () => navigateToOptionsPage(),
    },
    {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.rateAndReview,
      icon: <RateReviewIcon fontSize="small" />,
      action: () =>
        createNewTab(
          "https://chromewebstore.google.com/detail/tabtabtab-all-in-one-tab/hfmnidllojimehmfjkclnadpebibhgoi/reviews",
        ),
    },
    {
      type: "MenuItem",
      label: t.joinDiscussions,
      icon: <ForumIcon fontSize="small" />,
      action: () =>
        createNewTab("https://github.com/okaryo/TabTabTab/discussions"),
    },
    {
      type: "MenuItem",
      label: t.sponsorProject,
      icon: <VolunteerActivismIcon fontSize="small" />,
      action: () => createNewTab("https://www.buymeacoffee.com/okaryo"),
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

type StoredWindowActionMenuProps = Omit<ActionMenuProps, "items"> & {
  window: StoredWindow;
  onClickAddTabAction: () => void;
  onClickEditAction: () => void;
};
export const StoredWindowActionMenu = (props: StoredWindowActionMenuProps) => {
  const {
    window,
    onClickAddTabAction,
    onClickEditAction,
    isOpenMenu,
    anchorElement,
    onCloseMenu,
  } = props;
  const onClickAddButton = () => {
    onClickAddTabAction();
  };
  const onClickEditButton = () => {
    onClickEditAction();
  };
  const onClickRestoreButton = () => {
    restoreWindow(window);
  };
  const onClickRemoveButton = () => {
    removeStoredWindow(window.internalUid);
  };

  const items: ActionMenuItemAttrs[] = [
    {
      type: "MenuItem",
      label: t.addTab,
      icon: <AddIcon fontSize="small" />,
      action: onClickAddButton,
    },
    {
      type: "MenuItem",
      label: t.editTitle,
      icon: <EditIcon fontSize="small" />,
      action: onClickEditButton,
    },
    {
      type: "MenuItem",
      label: t.open,
      icon: <OpenInBrowserIcon fontSize="small" />,
      action: onClickRestoreButton,
    },
    {
      type: "Divider",
    },
    {
      type: "MenuItem",
      label: t.remove,
      icon: <DeleteIcon fontSize="small" />,
      action: onClickRemoveButton,
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
