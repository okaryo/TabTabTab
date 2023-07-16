import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import Header from "../components/Header";
import SearchResult from "../components/SearchResult";
import TabList from "../components/TabList";
import WindowTabs from "../components/WindowTabs";

const Home = () => {
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [popupSizeState, setPopupSizeState] = useState<PopupSize>(
    PopupSize.default(),
  );
  useEffect(() => {
    const initState = async () => {
      setPopupSizeState(await getPopupSizeSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const onChangeSearchText = (value: string) => {
    setSearchText(value);
  };

  return (
    <Box
      style={{
        maxHeight: popupSizeState.height,
        width: popupSizeState.width,
        overflowY: "auto",
      }}
    >
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
