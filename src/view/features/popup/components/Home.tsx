import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import { PopupSize, defaultPopupSize } from "../../../../model/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import RestorePage from "../../../components/RestorePage";
import StoredTabGroupsProvider from "../../../providers/StoredTabGroupsProvider";

import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

type Page = "root" | "restore";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("root");
  const [popupSizeState, setPopupSizeState] =
    useState<PopupSize>(defaultPopupSize);

  useEffect(() => {
    const initState = async () => {
      setPopupSizeState(await getPopupSizeSetting());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  return (
    <Box
      style={{
        maxHeight: popupSizeState.height,
        width: popupSizeState.width,
        overflowY: "auto",
      }}
    >
      <Header
        currentPage={currentPage}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setSearchText={setSearchText}
      />
      {searchText.length > 0 && <SearchResult searchText={searchText} />}
      {searchText.length === 0 && currentPage === "root" && (
        <WindowsContainer />
      )}
      {searchText.length === 0 && currentPage === "restore" && (
        <Box sx={{ p: 1 }}>
          <StoredTabGroupsProvider>
            <RestorePage dense />
          </StoredTabGroupsProvider>
        </Box>
      )}
    </Box>
  );
};

export default Home;
