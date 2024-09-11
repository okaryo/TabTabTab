import Clear from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { removeTabFromStoredTabGroup } from "../../../data/repository/TabGroupRepository";
import { createNewTab } from "../../../data/repository/TabsRepository";
import type { StoredTab } from "../../../model/Tab";
import type { StoredTabGroup } from "../../../model/TabContainer";
import TabFavicon from "../TabFavicon";

type StoredGridTabItemProps = {
  group: StoredTabGroup;
  tab: StoredTab;
};

export const StoredTabItem = (props: StoredGridTabItemProps) => {
  const { group, tab } = props;
  const [isHovered, setIsHovered] = useState(false);
  const onClickTabItem = () => createNewTab(tab.url.toString());
  const onClickDeleteIcon = () =>
    removeTabFromStoredTabGroup(group.internalUid, tab.internalUid);

  return (
    <ListItem
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      secondaryAction={
        isHovered && (
          <IconButton edge="end" onClick={onClickDeleteIcon}>
            <Clear fontSize="small" />
          </IconButton>
        )
      }
      disablePadding
    >
      <ListItemButton onClick={onClickTabItem}>
        <TabFavicon
          url={tab.favIconUrl}
          size={16}
          style={{ marginRight: "12px" }}
        />
        <ListItemText
          primary={tab.title}
          primaryTypographyProps={{
            style: {
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};
