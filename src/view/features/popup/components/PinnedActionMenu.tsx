/* eslint @typescript-eslint/no-misused-promises: 0 */

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PushPinIcon from "@mui/icons-material/PushPin";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import t from "../../../../i18n/Translations";
import { Pinned } from "../../../../model/TabContainer";
import { useCloseAllTabs } from "../hooks/useCloseAllTabs";
import { useUnpinAllTabs } from "../hooks/useUnpinAllTabs";

type PinnedActionMenuProps = {
  pinned: Pinned;
  isOpenMenu: boolean;
  anchorElement: HTMLElement;
  onCloseMenu: () => void;
};
type ActionMenuProps = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

const PinnedActionMenu = (props: PinnedActionMenuProps) => {
  const { pinned, isOpenMenu, anchorElement, onCloseMenu } = props;
  const unpinAllTabs = useUnpinAllTabs();
  const closeAllTabs = useCloseAllTabs();

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
      key={t.unpinAll}
      label={t.unpinAll}
      icon={<PushPinIcon fontSize="small" />}
      action={() => unpinAllTabs(pinned.children)}
    />,
    <ActionMenu
      key={t.closeAll}
      label={t.closeAll}
      icon={<HighlightOffIcon fontSize="small" />}
      action={() => closeAllTabs(pinned.children)}
    />,
  ];
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
    >
      {menus}
    </Menu>
  );
};

export default PinnedActionMenu;
