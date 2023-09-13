import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import grey from "@mui/material/colors/grey";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { TabGroup } from "../../../../model/TabContainer";
import { useCollapseTabGroup } from "../hooks/useCollapseTabGroup";
import { useExpandTabGroup } from "../hooks/useExpandTabGroup";

import TabGroupActionMenu from "./TabGroupActionMenu";

type TabGroupContainerProps = {
  children: React.ReactNode;
  tabGroup: TabGroup;
};

const TabGroupContainer = (props: TabGroupContainerProps) => {
  const { children, tabGroup } = props;
  const theme = useTheme();
  const collapseTabGroup = useCollapseTabGroup();
  const expandTabGroup = useExpandTabGroup();
  const toggleCollapsedStatus = () => {
    const newCollapsed = !tabGroup.collapsed;
    if (newCollapsed) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      collapseTabGroup(tabGroup.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expandTabGroup(tabGroup.id);
    }
  };
  const [isHovered, setIsHovered] = useState(false);

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickTabGroupActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);

  return (
    <Stack direction="row">
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <Stack direction="row">
          <Box
            style={{
              borderRight: `5px solid ${tabGroup.color.code}`,
              borderRadius: "0 5px 5px 0",
            }}
          />
          <Stack sx={{ width: "calc(100% - 5px)" }}>
            <ListItem
              secondaryAction={
                isHovered && (
                  <Stack direction="row">
                    <IconButton
                      edge="start"
                      onClick={onClickTabGroupActionMenu}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <IconButton edge="end" onClick={toggleCollapsedStatus}>
                      {tabGroup.collapsed ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                  </Stack>
                )
              }
              disablePadding
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ListItemButton
                onClick={toggleCollapsedStatus}
                style={{ cursor: "inherit" }}
              >
                {isHovered && (
                  <DragIndicatorIcon
                    sx={{ color: grey[400] }}
                    style={{
                      position: "absolute",
                      left: 0,
                    }}
                  />
                )}
                <Stack direction="row" spacing={1} alignItems="center">
                  {tabGroup.name !== "" && (
                    <Typography
                      variant="subtitle1"
                      component="h6"
                      sx={{ px: 1.25, py: 0.25 }}
                      style={{
                        display: "inline-block",
                        borderRadius: "8px",
                        backgroundColor: `${tabGroup.color.code}`,
                        color: theme.palette.getContrastText(
                          tabGroup.color.code,
                        ),
                      }}
                    >
                      {tabGroup.name}
                    </Typography>
                  )}
                  <Chip
                    sx={{
                      backgroundColor: props.tabGroup.color.code,
                      color: theme.palette.getContrastText(tabGroup.color.code),
                    }}
                    label={tabGroup.children.length}
                    size="small"
                  />
                </Stack>
              </ListItemButton>
              <TabGroupActionMenu
                tabGroup={tabGroup}
                isOpenMenu={Boolean(menuAnchorElement)}
                anchorElement={menuAnchorElement}
                onCloseMenu={onCloseMenu}
              />
            </ListItem>
            <Collapse in={!tabGroup.collapsed} timeout="auto" unmountOnExit>
              <List disablePadding>{children}</List>
            </Collapse>
          </Stack>
        </Stack>
      </List>
    </Stack>
  );
};

export default TabGroupContainer;
