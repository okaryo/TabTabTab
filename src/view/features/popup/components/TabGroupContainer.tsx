/* eslint-disable @typescript-eslint/no-floating-promises */

import CircleIcon from "@mui/icons-material/Circle";
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
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

import { GroupColor } from "../../../../model/GroupColor";
import { TabGroup } from "../../../../model/TabContainer";
import { useCollapseTabGroup } from "../hooks/useCollapseTabGroup";
import { useExpandTabGroup } from "../hooks/useExpandTabGroup";
import { useUpdateTabGroupColor } from "../hooks/useUpdateTabGroupColor";
import { useUpdateTabGroupTitle } from "../hooks/useUpdateTabGroupTitle";

import ActionMenu from "./ActionMenu";

type TabGroupContainerProps = {
  children: React.ReactNode;
  tabGroup: TabGroup;
};

const TabGroupContainer = (props: TabGroupContainerProps) => {
  const { children, tabGroup } = props;

  const editGroupFormRef = useRef<HTMLDivElement>(null);
  const [groupName, setGroupName] = useState(tabGroup.name);
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const theme = useTheme();
  const collapseTabGroup = useCollapseTabGroup();
  const expandTabGroup = useExpandTabGroup();
  const updateTabGroupTitle = useUpdateTabGroupTitle();
  const updateTabGroupColor = useUpdateTabGroupColor();

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

  const GroupColorRadio = (props: { color: GroupColor }) => {
    const { color } = props;

    return (
      <Radio
        sx={{
          p: 0,
          color: color.code,
          "&.Mui-checked": {
            color: color.code,
          },
        }}
        checked={tabGroup.color.value === color.value}
        icon={<CircleIcon sx={{ color: color.code }} />}
        onClick={(event) => {
          event.stopPropagation();
          updateTabGroupColor(tabGroup.id, color);
        }}
      />
    );
  };

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
  }, [editGroupFormRef]);

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
                        sx={{ px: 1.25, py: 0.25 }}
                        style={{
                          display: "inline-block",
                          borderRadius: "8px",
                          backgroundColor: `${tabGroup.color.code}`,
                          color: theme.palette.getContrastText(
                            tabGroup.color.code,
                          ),
                        }}
                        onClick={onClickGroupTitleToEditMode}
                      >
                        {!editMode && <>{tabGroup.name}</>}
                        {editMode && (
                          <TextField
                            variant="standard"
                            size="small"
                            value={groupName}
                            onChange={onChangeGroupTitleField}
                            autoFocus
                          />
                        )}
                      </Typography>
                    )}
                    <Chip
                      sx={{
                        backgroundColor: props.tabGroup.color.code,
                        color: theme.palette.getContrastText(
                          tabGroup.color.code,
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
                      {GroupColor.values.map((color) => (
                        <GroupColorRadio
                          key={color}
                          color={new GroupColor(color)}
                        />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </ListItemButton>
              <ActionMenu
                target={tabGroup}
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
