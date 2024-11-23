import Clear from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { createNewTab } from "../../../data/repository/TabsRepository";
import type { StoredTab } from "../../../model/Tab";
import TabFavicon from "../TabFavicon";

type StoredGridTabItemProps = {
  tab: StoredTab;
  onDeleteItem: () => void;
};

export const StoredTabItem = (props: StoredGridTabItemProps) => {
  const { tab, onDeleteItem } = props;
  const [isHovered, setIsHovered] = useState(false);
  const onClickTabItem = () => createNewTab(tab.url.toString());
  const onClickDeleteIcon = () => onDeleteItem();

  return (
    <ListItem
      title={tab.title}
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
