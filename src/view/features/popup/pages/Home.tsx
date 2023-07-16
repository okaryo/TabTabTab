import Box from "@mui/material/Box";
import React, { useState } from "react";

import Header from "../components/Header";
import SearchResult from "../components/SearchResult";
import TabList from "../components/TabList";
import WindowTabs from "../components/WindowTabs";

const Home = () => {
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);
  const [searchText, setSearchText] = useState("");

  const onChangeSearchText = (value: string) => {
    setSearchText(value);
  };

  return (
    <Box>
      <Header onChangeSearchText={onChangeSearchText} />
      {searchText.length > 0 && <SearchResult searchText={searchText} />}
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
