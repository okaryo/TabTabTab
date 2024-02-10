/* eslint @typescript-eslint/no-floating-promises: 0 */

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
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { useContext, useEffect, useRef, useState } from "react";

import t from "../../../i18n/Translations";
import { StoredWindow } from "../../../model/Window";
import { StoredWindowsContext } from "../../contexts/StoredWindows";
import { useRemoveStoredWindow } from "../../hooks/useRemoveStoredWindow";
import { useRestoreWindow } from "../../hooks/useRestoreWindow";
import { useUpdateStoredWindowName } from "../../hooks/useUpdateStoredWindowName";

import {
  StoredGridTabContainerItem,
  StoredGridTabItem,
} from "./StoredGridItem";

type StoredWindowsProps = {
  dense?: boolean;
};
type StoredWindowAccordionProps = {
  window: StoredWindow;
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

const StoredWindowAccordion = (props: StoredWindowAccordionProps) => {
  const { window, index, dense } = props;
  const theme = useTheme();
  const editWindowNameFormRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const [windowName, setWindowName] = useState(window.name);
  const [expanded, setExpanded] = useState(index === 0);
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const allCount = window.children
    .map((child) => ("children" in child ? child.children : child))
    .flat().length;

  const updateWindowName = useUpdateStoredWindowName();
  const restoreWindow = useRestoreWindow();
  const removeStoredWindow = useRemoveStoredWindow();
  const onChangeWindowNameField = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWindowName(event.target.value);
    updateWindowName(window.internalUid, event.target.value);
  };
  const onClickEditButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setEditMode(!editMode);
  };
  const onClickRestoreButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    restoreWindow(window);
  };
  const onClickRemoveButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeStoredWindow(window.internalUid);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickOutsideEditForm =
        editWindowNameFormRef.current &&
        !editWindowNameFormRef.current.contains(event.target as Node);
      const clickEditButton =
        editButtonRef.current &&
        editButtonRef.current.contains(event.target as Node);
      if (clickOutsideEditForm && !clickEditButton) {
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editWindowNameFormRef]);

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
        <Stack direction="row" spacing={1} alignItems="center">
          {!editMode && window.name !== "" && (
            <Typography
              variant="subtitle1"
              component="h6"
              sx={{ px: 1.25, py: 0.25 }}
              style={{
                display: "inline-block",
                borderRadius: "8px",
              }}
            >
              {window.name}
            </Typography>
          )}
          {editMode && (
            <TextField
              ref={editWindowNameFormRef}
              variant="standard"
              size="small"
              value={windowName}
              onClick={(e) => e.stopPropagation()}
              onChange={onChangeWindowNameField}
              autoFocus
            />
          )}
          <Chip label={allCount} size="small" color="info" />
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
        <Grid container alignItems="stretch" spacing={dense ? 1 : 2}>
          {window.children.map((child) => {
            if ("children" in child) {
              return (
                <StoredGridTabContainerItem
                  key={child.internalUid}
                  container={child}
                  xsSize={6}
                  mdSize={4}
                  dense={dense}
                />
              );
            }

            return (
              <StoredGridTabItem
                key={child.internalUid}
                tab={child}
                xsSize={6}
                mdSize={4}
                dense={dense}
              />
            );
          })}
        </Grid>
      </AccordionDetails>
    </OutlinedAccordion>
  );
};

const StoredWindows = (props: StoredWindowsProps) => {
  const { dense } = props;
  const { storedWindows } = useContext(StoredWindowsContext);
  const sortedWindows = storedWindows.sort((a, b) =>
    a.storedAt > b.storedAt ? -1 : 1,
  );

  return (
    <>
      {sortedWindows.length > 0 && (
        <Stack>
          {sortedWindows.map((window, index) => (
            <StoredWindowAccordion
              key={window.internalUid}
              window={window}
              index={index}
              dense={dense}
            />
          ))}
        </Stack>
      )}
      {sortedWindows.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ flexGrow: 1, p: 4 }}
          spacing={2}
        >
          <SyncIcon sx={{ fontSize: 96 }} />
          <Stack spacing={0.5} alignItems="center" justifyContent="center">
            <Typography variant="h5" component="h5">
              {t.noStoredWindowHeader}
            </Typography>
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ textAlign: "center", color: "text.secondary" }}
            >
              {t.noStoredWindowDescription}
            </Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default StoredWindows;
