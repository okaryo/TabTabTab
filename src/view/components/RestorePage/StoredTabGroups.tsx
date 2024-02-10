/* eslint @typescript-eslint/no-floating-promises: 0 */

import CircleIcon from "@mui/icons-material/Circle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import SyncIcon from "@mui/icons-material/Sync";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { useContext, useEffect, useRef, useState } from "react";

import t from "../../../i18n/Translations";
import { GroupColor } from "../../../model/GroupColor";
import { StoredTabGroup } from "../../../model/TabContainer";
import { StoredTabGroupsContext } from "../../contexts/StoredTabGroupsContext";
import { useRemoveStoredTabGroup } from "../../hooks/useRemoveStoredTabGroup";
import { useRestoreTabGroup } from "../../hooks/useRestoreTabGroup";
import { useUpdateStoredTabGroupColor } from "../../hooks/useUpdateStoredTabGroupColor";
import { useUpdateStoredTabGroupName } from "../../hooks/useUpdateStoredTabGroupName";

import { StoredGridTabItem } from "./StoredGridItem";

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
  const [groupName, setGroupName] = useState(group.name);
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);
  const [isHovered, setIsHovered] = useState(false);

  const restoreTabGroup = useRestoreTabGroup();
  const removeStoredTabGroup = useRemoveStoredTabGroup();
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

  const updateTabGroupName = useUpdateStoredTabGroupName();
  const updateTabGroupColor = useUpdateStoredTabGroupColor();
  const onChangeGroupNameField = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGroupName(event.target.value);
    updateTabGroupName(group.internalUid, event.target.value);
  };

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
        checked={group.color.value === color.value}
        icon={<CircleIcon sx={{ color: color.code }} />}
        onClick={(event) => {
          event.stopPropagation();
          updateTabGroupColor(group.internalUid, color);
        }}
      />
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickOutsideEditForm =
        editTabGroupFormRef.current &&
        !editTabGroupFormRef.current.contains(event.target as Node);
      const clickEditButton =
        editButtonRef.current &&
        editButtonRef.current.contains(event.target as Node);
      if (clickOutsideEditForm && !clickEditButton) {
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editTabGroupFormRef]);

  return (
    <OutlinedAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        sx={{
          px: dense ? 1 : 2,
          "&.Mui-focusVisible": {
            backgroundColor: "background.paper",
          },
        }}
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
                  backgroundColor: `${group.color.code}`,
                  color: theme.palette.getContrastText(group.color.code),
                }}
              >
                {!editMode && group.name}
                {editMode && (
                  <TextField
                    variant="standard"
                    size="small"
                    value={groupName}
                    onChange={onChangeGroupNameField}
                    autoFocus
                  />
                )}
              </Typography>
            )}
            <Chip
              sx={{
                backgroundColor: group.color.code,
                color: theme.palette.getContrastText(group.color.code),
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
              {GroupColor.values.map((color) => (
                <GroupColorRadio key={color} color={new GroupColor(color)} />
              ))}
            </Stack>
          )}
        </Stack>
        <Stack direction="row">
          {(expanded || isHovered) && (
            <>
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
      <AccordionDetails style={{ padding: theme.spacing(dense ? 1 : 2) }}>
        <Grid container spacing={dense ? 1 : 2}>
          {group.children.map((tab) => (
            <StoredGridTabItem
              key={tab.internalUid}
              tab={tab}
              xsSize={6}
              mdSize={4}
              dense={dense}
            />
          ))}
        </Grid>
      </AccordionDetails>
    </OutlinedAccordion>
  );
};

const StoredTabGroups = (props: StoredTabGroupsProps) => {
  const { dense } = props;
  const { storedTabGroups } = useContext(StoredTabGroupsContext);
  const sortedGroups = storedTabGroups.sort((a, b) =>
    a.storedAt > b.storedAt ? -1 : 1,
  );

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
