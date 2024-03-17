import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import grey from "@mui/material/colors/grey";
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import {
  collapseTabGroup,
  expandTabGroup,
  updateTabGroupColor,
  updateTabGroupTitle,
} from "../../data/repository/TabGroupRepository";
import {
  type TabGroup,
  adjacentToTabContainerAfter,
  adjacentToTabContainerBefore,
  tabGroupColors,
} from "../../model/TabContainer";
import { WindowsContext } from "../contexts/WindowsContext";
import { TabGroupActionMenu } from "./ActionMenu";
import TabGroupColorRadio from "./TabGroupColorRadio";

type TabGroupContainerProps = {
  children: React.ReactNode;
  tabGroup: TabGroup;
};

const TabGroupContainer = (props: TabGroupContainerProps) => {
  const { children, tabGroup } = props;
  const { windows } = useContext(WindowsContext);
  const editGroupFormRef = useRef<HTMLDivElement>(null);
  const [groupName, setGroupName] = useState(tabGroup.name);
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  const adjacentToTabContainerAbove = adjacentToTabContainerBefore(
    windows,
    tabGroup.id,
  );
  const adjacentToTabContainerBelow = adjacentToTabContainerAfter(
    windows,
    tabGroup.id,
  );

  const toggleCollapsedStatus = () => {
    if (editMode) {
      setEditMode(false);
      return;
    }

    const newCollapsed = !tabGroup.collapsed;
    if (newCollapsed) {
      collapseTabGroup(tabGroup.id);
    } else {
      expandTabGroup(tabGroup.id);
    }
  };

  const onClickGroupTitleToEditMode = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
    setEditMode(true);
  };

  const onChangeGroupTitleField = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGroupName(event.target.value);
    updateTabGroupTitle(tabGroup.id, event.target.value);
  };

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickTabGroupActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editGroupFormRef.current &&
        !editGroupFormRef.current.contains(event.target as Node)
      ) {
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Stack direction="row">
      <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
        <Stack direction="row">
          <Box
            style={{
              borderRight: `5px solid ${
                theme.palette.tabGroup[tabGroup.color]
              }`,
              borderRadius: `0 ${adjacentToTabContainerAbove ? "0" : "5px"} ${
                adjacentToTabContainerBelow ? "0" : "5px"
              } 0`,
            }}
          />
          <Stack sx={{ width: "calc(100% - 5px)" }}>
            <ListItem
              secondaryAction={
                <Stack direction="row">
                  {isHovered && (
                    <>
                      <IconButton
                        edge="start"
                        onClick={onClickTabGroupActionMenu}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                      />
                    </>
                  )}
                  <IconButton edge="end" onClick={toggleCollapsedStatus}>
                    {tabGroup.collapsed ? <ExpandMore /> : <ExpandLess />}
                  </IconButton>
                </Stack>
              }
              disablePadding
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <ListItemButton
                ref={editGroupFormRef}
                style={{ cursor: "inherit" }}
                onClick={toggleCollapsedStatus}
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
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {(tabGroup.name !== "" || editMode) && (
                      <Typography
                        variant="subtitle1"
                        component="h6"
                        sx={{ px: 1.25 }}
                        style={{
                          display: "inline-block",
                          borderRadius: "8px",
                          backgroundColor:
                            theme.palette.tabGroup[tabGroup.color],
                          color: theme.palette.getContrastText(
                            theme.palette.tabGroup[tabGroup.color],
                          ),
                        }}
                        onClick={onClickGroupTitleToEditMode}
                      >
                        {!editMode && tabGroup.name}
                        {editMode && (
                          <TextField
                            variant="standard"
                            size="small"
                            value={groupName}
                            sx={{
                              "& input": {
                                color: theme.palette.getContrastText(
                                  theme.palette.tabGroup[tabGroup.color],
                                ),
                              },
                            }}
                            onChange={onChangeGroupTitleField}
                            autoFocus
                          />
                        )}
                      </Typography>
                    )}
                    <Chip
                      sx={{
                        backgroundColor: theme.palette.tabGroup[tabGroup.color],
                        color: theme.palette.getContrastText(
                          theme.palette.tabGroup[tabGroup.color],
                        ),
                      }}
                      label={tabGroup.children.length}
                      size="small"
                      clickable={false}
                      onClick={onClickGroupTitleToEditMode}
                    />
                  </Stack>
                  {editMode && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      {tabGroupColors.map((color) => (
                        <TabGroupColorRadio
                          key={color}
                          color={color}
                          checked={tabGroup.color === color}
                          onClick={(event) => {
                            event.stopPropagation();
                            updateTabGroupColor(tabGroup.id, color);
                          }}
                        />
                      ))}
                    </Stack>
                  )}
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
