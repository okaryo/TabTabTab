import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  focusTab,
  getRecentActiveTabs,
} from "../../../../data/repository/TabsRepository";
import t from "../../../../i18n/Translations";
import type { Tab } from "../../../../model/Tab";
import { findTabsByTitleOrUrl } from "../../../../model/Window";
import {
  WindowsContext,
  WindowsProvider,
} from "../../../contexts/WindowsContext";
import groupTabsBySearchKeyword from "../../../functions/groupTabsBySearchKeyword";
import TabItem from "../../shared/components/TabItem";

const smoothScrollTo = (container: HTMLElement, targetScrollTop: number) => {
  const startScrollTop = container.scrollTop;
  const scrollDifference = targetScrollTop - startScrollTop;
  const duration = 300;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeInOutQuad =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    container.scrollTop = startScrollTop + scrollDifference * easeInOutQuad;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

type RecentActiveTabsProps = {
  parentRef: React.RefObject<HTMLDivElement>;
  tabs: Tab[];
  selectedIndex: number;
};
const RecentActiveTabs = (props: RecentActiveTabsProps) => {
  const { parentRef, tabs, selectedIndex } = props;
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (tabRefs.current[selectedIndex]) {
      const tabElement = tabRefs.current[selectedIndex];

      tabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      if (!parentRef.current) return;

      const parentElement = parentRef.current;
      const tabTop = tabElement.offsetTop;
      const parentScrollTop = parentElement.scrollTop;

      if (tabTop < parentScrollTop) {
        const stickyHeaderHeight = 48;
        smoothScrollTo(parentElement, tabTop - stickyHeaderHeight);
      }
    }
  }, [selectedIndex, parentRef]);

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
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
          >
            <TabItem
              tab={tab}
              selected={selectedIndex === index}
              showDragIndicatorIcon={false}
              showActions={false}
              showDuplicatedChip={false}
            />
          </div>
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
  parentRef: React.RefObject<HTMLDivElement>;
  searchText: string;
  searchedTabs: Tab[];
  selectedIndex: number;
  onClickGroupTabsButton: () => void;
};
const SearchedTabs = (props: SearchedTabsProps) => {
  const {
    parentRef,
    searchText,
    searchedTabs,
    selectedIndex,
    onClickGroupTabsButton,
  } = props;
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (tabRefs.current[selectedIndex]) {
      const tabElement = tabRefs.current[selectedIndex];

      tabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      if (!parentRef.current) return;

      const parentElement = parentRef.current;
      const tabTop = tabElement.offsetTop;
      const parentScrollTop = parentElement.scrollTop;

      if (tabTop < parentScrollTop) {
        const stickyHeaderHeight = 48;
        smoothScrollTo(parentElement, tabTop - stickyHeaderHeight);
      }
    }
  }, [selectedIndex, parentRef]);

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
        {searchedTabs.map((tab, index) => (
          <div
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
          >
            <TabItem
              tab={{ ...tab, active: false }}
              showDragIndicatorIcon={false}
              showBelongingContainer
              selected={selectedIndex === index}
            />
          </div>
        ))}
      </Paper>
    </List>
  );
};

const DialogFooter = () => {
  const theme = useTheme();

  return (
    <Stack
      component="footer"
      sx={{ py: 1, px: 1.5 }}
      direction="row"
      spacing={2}
    >
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="kbd"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.action.selected,
            borderRadius: 4,
            width: "20px",
            height: "18px",
          }}
        >
          <svg width="15" height="15" aria-label="Enter key" role="img">
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            >
              <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
            </g>
          </svg>
        </Box>
        <span>{t.toSelect}</span>
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="kbd"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.action.selected,
            borderRadius: 4,
            width: "20px",
            height: "18px",
          }}
        >
          <svg width="15" height="15" aria-label="Arrow down" role="img">
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            >
              <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
            </g>
          </svg>
        </Box>
        <Box
          component="kbd"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.action.selected,
            borderRadius: 4,
            width: "20px",
            height: "18px",
          }}
        >
          <svg width="15" height="15" aria-label="Arrow up" role="img">
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            >
              <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
            </g>
          </svg>
        </Box>
        <span>{t.toNavigate}</span>
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="kbd"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.palette.action.selected,
            borderRadius: 4,
            width: "20px",
            height: "18px",
          }}
        >
          <svg width="15" height="15" aria-label="Escape key" role="img">
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
            >
              <path d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" />
            </g>
          </svg>
        </Box>
        <span>{t.toClose}</span>
      </Typography>
    </Stack>
  );
};

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};
const SearchDialog = (props: SearchDialogProps) => {
  const { open, onClose } = props;
  const { windows } = useContext(WindowsContext);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [recentActiveTabs, setRecentActiveTabs] = useState<Tab[]>(null);
  const searchedTabs = findTabsByTitleOrUrl(windows, searchText);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const closeDialog = useCallback(() => {
    setSearchText("");
    setSelectedItemIndex(0);
    onClose();
  }, [onClose]);

  const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setSelectedItemIndex(0);
  };

  const onClearSearchText = () => {
    setSearchText("");
    setSelectedItemIndex(0);
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const minIndex = 0;
      const maxIndex = searchText
        ? searchedTabs.length - 1
        : recentActiveTabs.length - 1;

      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();

        if (event.key === "ArrowDown") {
          setSelectedItemIndex((oldIndex) =>
            oldIndex === maxIndex ? minIndex : oldIndex + 1,
          );
        } else if (event.key === "ArrowUp") {
          setSelectedItemIndex((oldIndex) =>
            oldIndex === minIndex ? maxIndex : oldIndex - 1,
          );
        }
      } else if (event.key === "Enter") {
        const tabs = searchText ? searchedTabs : recentActiveTabs;
        focusTab(tabs[selectedItemIndex]);
        closeDialog();

        // NOTE: Prevent default to avoid reopening the dialog when the Search Tabs button is focused
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    searchedTabs,
    recentActiveTabs,
    searchText,
    selectedItemIndex,
    closeDialog,
  ]);

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
          onChange={onChangeSearchText}
          fullWidth
          autoFocus
          slotProps={{
            htmlInput: {
              autoComplete: "off",
            },
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
        ref={bodyRef}
        sx={{
          overflowY: "auto",
          px: 2,
          pb: 2,
        }}
      >
        {!searchText && recentActiveTabs && recentActiveTabs.length > 0 && (
          <RecentActiveTabs
            parentRef={bodyRef}
            tabs={recentActiveTabs}
            selectedIndex={selectedItemIndex}
          />
        )}
        {searchText && searchedTabs.length === 0 && <NoResultsFound />}
        {searchText && searchedTabs.length > 0 && (
          <SearchedTabs
            parentRef={bodyRef}
            searchText={searchText}
            searchedTabs={searchedTabs}
            selectedIndex={selectedItemIndex}
            onClickGroupTabsButton={onClickGroupTabsButton}
          />
        )}
      </Box>
      <Divider />
      <DialogFooter />
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
