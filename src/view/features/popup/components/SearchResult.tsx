import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";

import t from "../../../../i18n/Translations";
import { focusTab } from "../../../../repository/TabsRepository";
import TabItem from "../components/TabItem";
import { WindowsContext } from "../contexts/Windows";

type SearchResultProps = {
  searchText: string;
};

const SearchResult = (props: SearchResultProps) => {
  const { searchText } = props;
  const { windows } = useContext(WindowsContext);
  const tabs = windows.findTabsByTitleOrUrl(searchText);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        const maxIndex = tabs.length - 1;
        setSelectedTabIndex((oldIndex) =>
          oldIndex === maxIndex ? maxIndex : oldIndex + 1,
        );
      } else if (event.key === "ArrowUp") {
        const minIndex = 0;
        setSelectedTabIndex((oldIndex) =>
          oldIndex === minIndex ? 0 : oldIndex - 1,
        );
      } else if (event.key === "Enter") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        focusTab(tabs[selectedTabIndex].id);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedTabIndex, tabs]);

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
          // onKeyDown={onKeyDown}
          sx={{ width: "100%", bgcolor: "background.paper" }}
          disablePadding
        >
          {tabs.map((tab, i) => (
            <TabItem
              key={tab.id.value}
              tab={tab}
              selected={selectedTabIndex === i}
            />
          ))}
        </List>
      )}
    </>
  );
};

export default SearchResult;
