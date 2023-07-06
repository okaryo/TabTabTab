import Box from "@mui/material/Box";
import List from "@mui/material/List";
import React, { useContext, useState } from "react";

import Header from "../components/Header";
import TabItem from "../components/TabItem";
import TabList from "../components/TabList";
import WindowTabs from "../components/WindowTabs";
import { WindowsContext } from "../contexts/Windows";

const Home = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchText, setSearchText] = React.useState("");
  const { windows } = useContext(WindowsContext);
  const tabs = windows.findTabsByTitleOrUrl(searchText);

  return (
    <Box>
      <Header onChange={setSearchText} />
      {searchText.length > 0 && (
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          disablePadding
        >
          {tabs.map((tab) => (
            <TabItem key={tab.id.value} tab={tab} />
          ))}
        </List>
      )}
      {searchText.length === 0 && (
        <>
          <WindowTabs
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
          />
          <TabList selectedWindowIndex={selectedIndex} />
        </>
      )}
    </Box>
  );
};

export default Home;
