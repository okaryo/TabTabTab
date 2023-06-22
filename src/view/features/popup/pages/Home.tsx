import Box from "@mui/material/Box";
import React, { useState } from "react";

import Header from "../components/Header";
import TabList from "../components/TabList";
import WindowTabs from "../components/WindowTabs";

const Home = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box>
      <Header />
      <WindowTabs
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
      />
      <TabList selectedWindowIndex={selectedIndex} />
    </Box>
  );
};

export default Home;
