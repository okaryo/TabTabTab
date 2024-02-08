/* eslint @typescript-eslint/no-floating-promises: 0 */

import DeleteIcon from "@mui/icons-material/Delete";
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
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { useContext, useState } from "react";

import t from "../../../i18n/Translations";
import { StoredTabGroup } from "../../../model/TabContainer";
import { StoredTabGroupsContext } from "../../contexts/StoredTabGroups";
import { useRemoveStoredTabGroup } from "../../hooks/useRemoveStoredTabGroup";
import { useRestoreTabGroup } from "../../hooks/useRestoreTabGroup";
import TabFavicon from "../TabFavicon";

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
  const [expanded, setExpanded] = useState(index === 0);
  const [isHovered, setIsHovered] = useState(false);

  const restoreTabGroup = useRestoreTabGroup();
  const removeStoredTabGroup = useRemoveStoredTabGroup();
  const onClickRestoreButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    restoreTabGroup(group);
  };
  const onClickRemoveButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeStoredTabGroup(group.internalUid);
  };

  return (
    <OutlinedAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        sx={{ px: dense ? 1 : 2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {group.name !== "" && (
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
              {group.name}
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
        <Stack direction="row">
          {(expanded || isHovered) && (
            <>
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
            <Grid key={tab.internalUid} xs={6} md={4}>
              <Paper variant="outlined">
                <ListItem
                  sx={{ gap: 2, py: dense ? 0.5 : 1, px: dense ? 1 : 2 }}
                >
                  <TabFavicon url={tab.favIconUrl} />
                  <ListItemText
                    sx={{ my: 0.5 }}
                    primary={
                      <Typography
                        variant="subtitle2"
                        component="p"
                        title={tab.title}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tab.title}
                      </Typography>
                    }
                    secondary={tab.url.host}
                    secondaryTypographyProps={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItem>
              </Paper>
            </Grid>
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
