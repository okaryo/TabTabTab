import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import SyncIcon from "@mui/icons-material/Sync";
import MuiAccordion, { type AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import {
  addTabToSavedGroup,
  removeStoredTabGroup,
  removeTabFromStoredTabGroup,
  restoreTabGroup,
  updateStoredTabGroupColor,
  updateStoredTabGroupName,
} from "../../../../../data/repository/TabGroupRepository";
import t from "../../../../../i18n/Translations";
import { isLoading } from "../../../../../model/AsyncState";
import {
  type StoredTabGroup,
  tabGroupColors,
} from "../../../../../model/TabContainer";
import { StoredTabGroupsContext } from "../../../../contexts/StoredTabGroupsContext";
import TabGroupColorRadio from "../TabGroupColorRadio";
import AddTabForm from "./AddTabFrom";
import StoredTabItem from "./StoredTabItem";

type StoredTabGroupsProps = {
  dense: boolean;
};
type StoredTabGroupAccordionProps = {
  group: StoredTabGroup;
  index: number;
  dense: boolean;
};

const OutlinedAccordion = styled((props: AccordionProps) => (
  <MuiAccordion variant="outlined" disableGutters {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled(MuiAccordionSummary)(() => ({
  "& .MuiAccordionSummary-content": {
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}}`,
}));

const StoredTabGroupAccordion = (props: StoredTabGroupAccordionProps) => {
  const { group, index, dense } = props;
  const theme = useTheme();
  const editTabGroupFormRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const addTabFormRef = useRef<HTMLDivElement>(null);
  const addTabButtonRef = useRef<HTMLButtonElement>(null);
  const [addTabMode, setAddTabMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);
  const [isHovered, setIsHovered] = useState(false);

  const onClickAddButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAddTabMode(!addTabMode);
    if (!expanded) {
      setExpanded(true);
    }
  };
  const onClickEditButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEditMode(!editMode);
  };
  const onClickRestoreButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    restoreTabGroup(group);
  };
  const onClickRemoveButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeStoredTabGroup(group.internalUid);
  };

  const onChangeGroupNameField = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateStoredTabGroupName(group.internalUid, event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickOutsideEditForm =
        editTabGroupFormRef.current &&
        !editTabGroupFormRef.current.contains(event.target as Node);
      const clickEditButton = editButtonRef.current?.contains(
        event.target as Node,
      );
      if (clickOutsideEditForm && !clickEditButton) {
        setEditMode(false);
      }

      const clickOutsideAddTabForm =
        addTabFormRef.current &&
        !addTabFormRef.current.contains(event.target as Node);
      const clickAddTabButton = addTabButtonRef.current?.contains(
        event.target as Node,
      );
      if (clickOutsideAddTabForm && !clickAddTabButton) {
        setAddTabMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <OutlinedAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        sx={[
          {
            px: dense ? 1 : 2,
            "&.Mui-focusVisible": {
              backgroundColor: "background.paper",
            },
            backgroundColor: grey[100],
          },
          (theme) =>
            theme.applyStyles("dark", {
              backgroundColor: alpha(grey[800], 0.4),
            }),
        ]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack
          ref={editTabGroupFormRef}
          spacing={1}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {(editMode || group.name !== "") && (
              <Typography
                variant="subtitle1"
                component="h6"
                sx={{ px: 1.25, py: 0.25 }}
                style={{
                  display: "inline-block",
                  borderRadius: "8px",
                  backgroundColor: theme.palette.tabGroup[group.color],
                  color: theme.palette.getContrastText(
                    theme.palette.tabGroup[group.color],
                  ),
                }}
              >
                {!editMode && group.name}
                {editMode && (
                  <TextField
                    variant="standard"
                    size="small"
                    value={group.name}
                    sx={{
                      "& input": {
                        color: theme.palette.getContrastText(
                          theme.palette.tabGroup[group.color],
                        ),
                      },
                    }}
                    onChange={onChangeGroupNameField}
                    autoFocus
                  />
                )}
              </Typography>
            )}
            <Chip
              sx={{
                backgroundColor: theme.palette.tabGroup[group.color],
                color: theme.palette.getContrastText(
                  theme.palette.tabGroup[group.color],
                ),
              }}
              label={group.children.length}
              size="small"
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
                  checked={group.color === color}
                  onClick={(event) => {
                    event.stopPropagation();
                    updateStoredTabGroupColor(group.internalUid, color);
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
        <Stack direction="row">
          {(expanded || isHovered) && (
            <>
              <IconButton ref={addTabButtonRef} onClick={onClickAddButton}>
                <AddIcon />
              </IconButton>
              <IconButton ref={editButtonRef} onClick={onClickEditButton}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={onClickRestoreButton}>
                <OpenInBrowserIcon />
              </IconButton>
              <IconButton onClick={onClickRemoveButton}>
                <DeleteIcon />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem />
            </>
          )}
          <IconButton>
            {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails style={{ padding: 0 }}>
        <List dense disablePadding>
          {group.children.map((tab) => (
            <StoredTabItem
              key={tab.internalUid}
              tab={tab}
              onDeleteItem={() =>
                removeTabFromStoredTabGroup(group.internalUid, tab.internalUid)
              }
            />
          ))}
          {addTabMode && (
            <AddTabForm
              ref={addTabFormRef}
              onComplete={({ title, url, favIconUrl }) => {
                addTabToSavedGroup(group.internalUid, {
                  title,
                  url,
                  favIconUrl,
                });
                setAddTabMode(false);
              }}
              onCancel={() => setAddTabMode(false)}
            />
          )}
        </List>
      </AccordionDetails>
    </OutlinedAccordion>
  );
};

const StoredTabGroups = (props: StoredTabGroupsProps) => {
  const { dense } = props;
  const state = useContext(StoredTabGroupsContext);
  const sortedGroups = state.value?.sort((a, b) =>
    a.storedAt > b.storedAt ? -1 : 1,
  );

  if (isLoading(state)) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {sortedGroups.length > 0 && (
        <Stack>
          {sortedGroups.map((group, index) => (
            <StoredTabGroupAccordion
              key={group.internalUid}
              group={group}
              index={index}
              dense={dense}
            />
          ))}
        </Stack>
      )}
      {sortedGroups.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ flexGrow: 1, p: 4 }}
          spacing={2}
        >
          <SyncIcon sx={{ fontSize: 96 }} />
          <Stack spacing={0.5} alignItems="center" justifyContent="center">
            <Typography variant="h5" component="h5">
              {t.noStoredTabGroupHeader}
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              {t.noStoredTabGroupDescription}
            </Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default StoredTabGroups;
