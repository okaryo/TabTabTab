import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useRef, useState } from "react";
import t from "../../../../i18n/Translations";
import { Tab } from "../../../../model/Tab";
import { findTabsByTitleOrUrl } from "../../../../model/Window";
import {
  focusTab,
  getRecentActiveTabs,
} from "../../../../repository/TabsRepository";
import TabItem from "../../../components/TabItem";
import { WindowsContext } from "../../../contexts/WindowsContext";

type SearchResultProps = {
  searchText: string;
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
  const { searchText } = props;
  const { windows } = useContext(WindowsContext);
  const tabs = findTabsByTitleOrUrl(windows, searchText);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const minIndex = 0;
      const maxIndex = tabs.length - 1;

      if (event.key === "ArrowDown") {
        setSelectedTabIndex((oldIndex) =>
          oldIndex === maxIndex ? minIndex : oldIndex + 1,
        );
      } else if (event.key === "ArrowUp") {
        setSelectedTabIndex((oldIndex) =>
          oldIndex === minIndex ? maxIndex : oldIndex - 1,
        );
      } else if (event.key === "Enter") {
        focusTab(tabs[selectedTabIndex]);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [tabs[selectedTabIndex]]);

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

  return (
    <>
      {tabs.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ ml: 2, textAlign: "center" }}
          >
            {t.noResultsFound}
          </Typography>
        </Box>
      )}
      {tabs.length > 0 && (
        <List
          ref={containerRef}
          sx={{ width: "100%", bgcolor: "background.paper", overflowY: "auto" }}
          disablePadding
        >
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.id}
              ref={index === selectedTabIndex ? selectedItemRef : null}
              tab={{ ...tab, active: false }}
              selected={selectedTabIndex === index}
              showDragIndicatorIcon={false}
              showBelongingGroup
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
