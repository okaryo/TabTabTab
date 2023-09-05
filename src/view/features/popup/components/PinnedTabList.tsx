import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PushPin from "@mui/icons-material/PushPin";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import t from "../../../../i18n/Translations";
import { Pinned } from "../../../../model/TabContainer";

import TabItem from "./TabItem";

type PinnedTabListProps = {
  pinned: Pinned;
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const PinnedTabList = (props: PinnedTabListProps) => {
  const { pinned, collapsed, toggleCollapsed } = props;

  return (
    <Stack id={pinned.id} direction="row">
      <Box
        style={{
          borderRight: "5px solid #818181",
          borderRadius: "0 5px 5px 0",
        }}
      />
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <Stack>
          <ListItem
            secondaryAction={
              <IconButton edge="end" onClick={toggleCollapsed}>
                {collapsed ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton onClick={toggleCollapsed}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PushPin fontSize="small" />
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="h6">
                      {t.pinned}
                    </Typography>
                  }
                />
                <Chip
                  label={pinned.children.length}
                  size="small"
                  color="info"
                />
              </Stack>
            </ListItemButton>
          </ListItem>
        </Stack>
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <List disablePadding>
            {pinned.children.map((tab) => (
              <TabItem tab={tab} />
            ))}
          </List>
        </Collapse>
      </List>
    </Stack>
  );
};

export default PinnedTabList;
