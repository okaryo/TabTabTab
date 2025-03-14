import SearchOffIcon from "@mui/icons-material/SearchOff";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useRef, useState } from "react";
import {
  focusTab,
  getRecentActiveTabs,
} from "../../../../data/repository/TabsRepository";
import t from "../../../../i18n/Translations";
import type { Tab } from "../../../../model/Tab";
import { findTabsByTitleOrUrl } from "../../../../model/Window";
import { WindowsContext } from "../../../contexts/WindowsContext";
import groupTabsBySearchKeyword from "../../../functions/groupTabsBySearchKeyword";
import TabItem from "../../shared/components/TabItem";

type SearchResultProps = {
  searchText: string;
  resetSearch: () => void;
};
type RecentActiveTabsProps = {
  recentActiveTabs: Tab[];
};

const RecentActiveTabs = (props: RecentActiveTabsProps) => {
  const { recentActiveTabs } = props;

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper", overflowY: "auto" }}
      disablePadding
      subheader={
        <ListSubheader component="div">
          {t.recentActiveTabsHeader}
        </ListSubheader>
      }
    >
      {recentActiveTabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          selected={false}
          showDragIndicatorIcon={false}
          showActions={false}
          showDuplicatedChip={false}
        />
      ))}
    </List>
  );
};

const SearchResult = (props: SearchResultProps) => {
  const { searchText, resetSearch } = props;
  const { windows } = useContext(WindowsContext);
  const tabs = findTabsByTitleOrUrl(windows, searchText);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const minIndex = 0;
      const maxIndex = tabs.length - 1;

      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();

        if (event.key === "ArrowDown") {
          setSelectedTabIndex((oldIndex) =>
            oldIndex === maxIndex ? minIndex : oldIndex + 1,
          );
        } else if (event.key === "ArrowUp") {
          setSelectedTabIndex((oldIndex) =>
            oldIndex === minIndex ? maxIndex : oldIndex - 1,
          );
        }
      } else if (event.key === "Enter") {
        focusTab(tabs[selectedTabIndex]);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedTabIndex, tabs[selectedTabIndex]]);

  const [recentActiveTabs, setRecentActiveTabs] = useState<Tab[]>(null);
  useEffect(() => {
    const initializeState = async () => {
      const tabs = await getRecentActiveTabs();
      setRecentActiveTabs(tabs);
    };
    initializeState();
  }, []);

  const containerRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (selectedItemRef.current) {
      const windowHeight = window.innerHeight;
      const selectedItem = selectedItemRef.current;
      const { top, bottom } = selectedItem.getBoundingClientRect();

      if (top < 0 || bottom > windowHeight) {
        selectedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, []);

  const onClickGroupTabsButton = () => {
    const tabIds = tabs.map((t) => t.id);
    groupTabsBySearchKeyword(searchText, windows, tabIds);

    resetSearch();
  };

  return (
    <>
      {tabs.length === 0 && (
        <Stack sx={{ p: 2, alignItems: "center" }} spacing={1}>
          <SearchOffIcon fontSize="large" />
          <Typography
            variant="h6"
            component="h2"
            sx={{ ml: 2, textAlign: "center" }}
          >
            {t.noResultsFound}
          </Typography>
        </Stack>
      )}
      {tabs.length > 0 && (
        <List
          ref={containerRef}
          sx={{ width: "100%", bgcolor: "background.paper", overflowY: "auto" }}
          disablePadding
        >
          <Box sx={{ m: 1 }}>
            <Tooltip title={t.groupTabsSearchResultTabsDescription}>
              <Button
                variant="contained"
                sx={{ width: "100%", textTransform: "none" }}
                onClick={onClickGroupTabsButton}
              >
                {`${t.groupTabsSearchResultTabs}: ${searchText}`}
              </Button>
            </Tooltip>
          </Box>
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.id}
              ref={index === selectedTabIndex ? selectedItemRef : null}
              tab={{ ...tab, active: false }}
              selected={selectedTabIndex === index}
              showDragIndicatorIcon={false}
              showBelongingContainer
            />
          ))}
        </List>
      )}
      {recentActiveTabs && recentActiveTabs.length > 0 && (
        <>
          <Divider />
          <RecentActiveTabs recentActiveTabs={recentActiveTabs} />
        </>
      )}
    </>
  );
};

export default SearchResult;
