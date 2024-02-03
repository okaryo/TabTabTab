import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";

import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

const Home = () => {
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
      {searchText.length === 0 && <WindowsContainer />}
    </Box>
  );
};

export default Home;
