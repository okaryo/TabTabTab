/* eslint @typescript-eslint/no-misused-promises: 0 */

import CropFreeIcon from "@mui/icons-material/CropFree";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import t from "../../../../i18n/Translations";
import { TabGroup } from "../../../../model/TabContainer";
import { useCloseTabGroup } from "../hooks/useCloseTabGroup";
import { useUngroup } from "../hooks/useUngroup";

type TabGroupActionMenuProps = {
  tabGroup: TabGroup;
  isOpenMenu: boolean;
  anchorElement: HTMLElement;
  onCloseMenu: () => void;
};
type ActionMenuProps = {
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

const TabGroupActionMenu = (props: TabGroupActionMenuProps) => {
  const { tabGroup, isOpenMenu, anchorElement, onCloseMenu } = props;
  const ungroup = useUngroup();
  const closeTabGroup = useCloseTabGroup();

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
      key={t.ungroup}
      label={t.ungroup}
      icon={<CropFreeIcon fontSize="small" />}
      action={() => ungroup(tabGroup)}
    />,
    <ActionMenu
      key={t.closeGroup}
      label={t.closeGroup}
      icon={<HighlightOffIcon fontSize="small" />}
      action={() => closeTabGroup(tabGroup)}
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

export default TabGroupActionMenu;
