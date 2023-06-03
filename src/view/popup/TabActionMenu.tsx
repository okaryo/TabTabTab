import BookmarkIcon from "@mui/icons-material/Bookmark";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

import { Tab } from "./../../model/Tab";
import { bookmarkTab } from "./../../repository/TabsRepository";

type TabActionMenuProps = {
  tab: Tab;
  isOpenMenu: boolean;
  anchorPostion: AnchorPosition;
  onCloseMenu: () => void;
  onMenuActionCompleted: () => void;
};
type AnchorPosition = { top: number; left: number } | null;

const TabActionMenu = (props: TabActionMenuProps) => {
  const { tab, isOpenMenu, anchorPostion, onCloseMenu, onMenuActionCompleted } =
    props;

  const onBookMark = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    bookmarkTab(tab.title, tab.url);
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
      <MenuItem onClick={onBookMark} style={{ minHeight: "24px" }}>
        <ListItemIcon>
          <BookmarkIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Bookmark</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default TabActionMenu;
