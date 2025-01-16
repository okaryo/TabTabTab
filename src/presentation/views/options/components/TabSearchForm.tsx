import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { getRecentActiveTabs } from "../../../../data/repository/TabsRepository";
import t from "../../../../i18n/Translations";
import type { Tab } from "../../../../model/Tab";
import { findTabsByTitleOrUrl } from "../../../../model/Window";
import {
  WindowsContext,
  WindowsProvider,
} from "../../../contexts/WindowsContext";
import groupTabsBySearchKeyword from "../../../functions/groupTabsBySearchKeyword";
import TabItem from "../../shared/components/TabItem";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

const RecentActiveTabs = ({ tabs }: { tabs: Tab[] }) => {
  return (
    <List
      sx={{ width: "100%" }}
      disablePadding
      subheader={
        <ListSubheader
          component="div"
          disableGutters
          color="primary"
          style={{ backgroundImage: "var(--Paper-overlay)" }}
        >
          {t.recentActiveTabsHeader}
        </ListSubheader>
      }
    >
      <Paper variant="outlined" style={{ overflow: "hidden" }}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            selected={false}
            showDragIndicatorIcon={false}
            showActions={false}
            showDuplicatedChip={false}
          />
        ))}
      </Paper>
    </List>
  );
};

const NoResultsFound = () => {
  return (
    <Stack sx={{ p: 4, alignItems: "center" }} spacing={2}>
      <SearchOffIcon sx={{ fontSize: 48 }} />
      <Typography
        variant="h6"
        component="h2"
        sx={{ ml: 2, textAlign: "center" }}
      >
        {t.noResultsFound}
      </Typography>
    </Stack>
  );
};

type SearchedTabsProps = {
  searchText: string;
  searchedTabs: Tab[];
  onClickGroupTabsButton: () => void;
};
const SearchedTabs = (props: SearchedTabsProps) => {
  const { searchText, searchedTabs, onClickGroupTabsButton } = props;

  return (
    <List
      sx={{ width: "100%" }}
      disablePadding
      subheader={
        <ListSubheader
          component="div"
          disableGutters
          color="primary"
          sx={{ py: 1 }}
          style={{ backgroundImage: "var(--Paper-overlay)", lineHeight: 1.5 }}
        >
          <Tooltip title={t.groupTabsSearchResultTabsDescription}>
            <Button
              variant="contained"
              sx={{ width: "100%", textTransform: "none" }}
              onClick={onClickGroupTabsButton}
            >
              {`${t.groupTabsSearchResultTabs}: ${searchText}`}
            </Button>
          </Tooltip>
        </ListSubheader>
      }
    >
      <Paper variant="outlined" style={{ overflow: "hidden" }}>
        {searchedTabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={{ ...tab, active: false }}
            showDragIndicatorIcon={false}
            showBelongingContainer
          />
        ))}
      </Paper>
    </List>
  );
};

const SearchDialog = (props: SearchDialogProps) => {
  const { open, onClose } = props;
  const { windows } = useContext(WindowsContext);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [recentActiveTabs, setRecentActiveTabs] = useState<Tab[]>(null);
  const searchedTabs = findTabsByTitleOrUrl(windows, searchText);

  const closeDialog = () => {
    setSearchText("");
    onClose();
  };

  const onClearSearchText = () => {
    setSearchText("");
    textFieldRef.current?.focus();
  };

  const onClickGroupTabsButton = () => {
    const tabIds = searchedTabs.map((t) => t.id);
    groupTabsBySearchKeyword(searchText, windows, tabIds);

    closeDialog();
  };

  useEffect(() => {
    const initializeState = async () => {
      const tabs = await getRecentActiveTabs();
      setRecentActiveTabs(tabs);
    };
    initializeState();
  }, []);

  return (
    <Dialog
      sx={{
        maxHeight: 600,
        "& .MuiDialog-container": {
          alignItems: "flex-start",
        },
      }}
      fullWidth
      open={open}
      onClose={closeDialog}
    >
      <Container sx={{ pt: 2, px: 2 }} disableGutters>
        <TextField
          inputRef={textFieldRef}
          placeholder={t.searchTabs}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          fullWidth
          autoFocus
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton onClick={onClearSearchText}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Container>
      <Box
        sx={{
          overflowY: "auto",
          px: 2,
          pb: 2,
        }}
      >
        {!searchText && recentActiveTabs && recentActiveTabs.length > 0 && (
          <RecentActiveTabs tabs={recentActiveTabs} />
        )}
        {searchText && searchedTabs.length === 0 && <NoResultsFound />}
        {searchText && searchedTabs.length > 0 && (
          <SearchedTabs
            searchText={searchText}
            searchedTabs={searchedTabs}
            onClickGroupTabsButton={onClickGroupTabsButton}
          />
        )}
      </Box>
    </Dialog>
  );
};

const TabSearchForm = () => {
  const theme = useTheme();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !openSearchDialog) {
        event.preventDefault();
        setOpenSearchDialog(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearchDialog]);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SearchIcon />}
        endIcon={
          <Chip
            style={{
              borderRadius: 8,
              fontWeight: "bold",
              marginLeft: theme.spacing(4),
              color: "inherit",
            }}
            label="/"
            component="kbd"
            variant="outlined"
            size="small"
          />
        }
        sx={{
          textTransform: "none",
          color: "inherit",
          borderColor: theme.palette.divider,
          backgroundColor: alpha(theme.palette.common.white, 0.15),
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
          },
          transition: "border-color 0.2s",
        }}
        onClick={() => setOpenSearchDialog(true)}
      >
        {t.searchTabs}
      </Button>
      <WindowsProvider>
        <SearchDialog
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
        />
      </WindowsProvider>
    </>
  );
};

export default TabSearchForm;
