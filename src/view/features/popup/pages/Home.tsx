import Box from "@mui/material/Box";
import List from "@mui/material/List";
import React, { useContext, useState } from "react";

import { focusTab } from "../../../../repository/TabsRepository";
import Header from "../components/Header";
import TabItem from "../components/TabItem";
import TabList from "../components/TabList";
import WindowTabs from "../components/WindowTabs";
import { WindowsContext } from "../contexts/Windows";

const Home = () => {
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { windows } = useContext(WindowsContext);
  const tabs = windows.findTabsByTitleOrUrl(searchText);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      const maxIndex = tabs.length - 1;
      setSelectedTabIndex((oldIndex) =>
        oldIndex === maxIndex ? oldIndex : oldIndex + 1,
      );
    } else if (event.key === "ArrowUp") {
      const minIndex = 0;
      setSelectedTabIndex((oldIndex) =>
        oldIndex === minIndex ? oldIndex : oldIndex - 1,
      );
    } else if (event.key === "ArrowRight") {
      const maxWindowIndex = windows.length - 1;
      setSelectedWindowIndex((oldIndex) =>
        oldIndex === maxWindowIndex ? 0 : oldIndex + 1,
      );
    } else if (event.key === "ArrowLeft") {
      const minWindowIndex = 0;
      setSelectedWindowIndex((oldIndex) =>
        oldIndex === minWindowIndex ? windows.length - 1 : oldIndex - 1,
      );
    } else if (event.key === "Enter") {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      focusTab(tabs[selectedTabIndex].id);
    }
  };

  const onChangeSearchText = (value: string) => {
    setSelectedTabIndex(0);
    setSearchText(value);
  };

  return (
    <Box onKeyDown={onKeyDown}>
      <Header onChangeSearchText={onChangeSearchText} />
      {searchText.length > 0 && (
        <List
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
      {searchText.length === 0 && (
        <>
          <WindowTabs
            selectedIndex={selectedWindowIndex}
            onSelectIndex={setSelectedWindowIndex}
          />
          <TabList selectedWindowIndex={selectedWindowIndex} />
        </>
      )}
    </Box>
  );
};

export default Home;
