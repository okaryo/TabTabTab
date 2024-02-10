import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import { PopupSize } from "../../../../model/settings/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import RestorePage from "../../../components/RestorePage";
import StoredTabGroupsProvider from "../../options/components/StoredTabGroupsProvider";

import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

type Page = "list" | "restore";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState<Page>("list");
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

  const onChangeSearchText = (value: string) => setSearchText(value);
  const onChangePage = (page: Page) => setCurrentPage(page);

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
        onChangePage={onChangePage}
        onChangeSearchText={onChangeSearchText}
      />
      {searchText.length > 0 && currentPage === "list" && (
        <SearchResult searchText={searchText} />
      )}
      {searchText.length === 0 && currentPage === "list" && (
        <WindowsContainer />
      )}
      {currentPage === "restore" && (
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
