import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getPopupSizeSetting } from "../../../../data/repository/SettingsRepository";
import { defaultPopupSize, type PopupSize } from "../../../../model/PopupSize";
import SaveAndRestorePage from "../../shared/components/SaveAndRestorePage";
import SettingsPage from "../../shared/components/SettingsPage";
import TidyTabsPage from "../../shared/components/TidyTabsPage";
import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

export type PopupPage = "root" | "saveAndRestore" | "tidyTabs" | "settings";
type HomeProps = {
  sidePanel: boolean;
};

const Home = (props: HomeProps) => {
  const { sidePanel } = props;
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState<PopupPage>("root");
  const [popupSizeState, setPopupSizeState] =
    useState<PopupSize>(defaultPopupSize);

  const clearSearchText = () => {
    setSearchText("");
  };

  useEffect(() => {
    const initState = async () => {
      setPopupSizeState(await getPopupSizeSetting());
    };
    initState();
  }, []);

  return (
    <Box
      style={{
        maxHeight: sidePanel ? undefined : popupSizeState.height,
        width: sidePanel ? "100%" : popupSizeState.width,
        overflowY: "auto",
      }}
    >
      <Header
        sidePanel={sidePanel}
        currentPage={currentPage}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setSearchText={setSearchText}
      />
      {searchText.length > 0 && (
        <SearchResult searchText={searchText} resetSearch={clearSearchText} />
      )}
      {searchText.length === 0 && currentPage === "root" && (
        <WindowsContainer />
      )}
      {searchText.length === 0 && currentPage === "saveAndRestore" && (
        <Box sx={{ p: 1 }}>
          <SaveAndRestorePage dense />
        </Box>
      )}
      {searchText.length === 0 && currentPage === "tidyTabs" && (
        <Box sx={{ p: 1 }}>
          <TidyTabsPage dense />
        </Box>
      )}
      {searchText.length === 0 && currentPage === "settings" && (
        <Box sx={{ p: 1 }}>
          <SettingsPage />
        </Box>
      )}
    </Box>
  );
};

export default Home;
