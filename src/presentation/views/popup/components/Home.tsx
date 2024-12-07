import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { getPopupSizeSetting } from "../../../../data/repository/SettingsRepository";
import { type PopupSize, defaultPopupSize } from "../../../../model/PopupSize";
import OrganizationPage from "../../shared/components/OrganizationPage";
import SaveAndRestorePage from "../../shared/components/SaveAndRestorePage";
import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

export type PopupPage = "root" | "saveAndRestore" | "organization";
type HomeProps = {
  sidePanel: boolean;
};

const Home = (props: HomeProps) => {
  const { sidePanel } = props;
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState<PopupPage>("root");
  const [popupSizeState, setPopupSizeState] =
    useState<PopupSize>(defaultPopupSize);

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
      {searchText.length > 0 && <SearchResult searchText={searchText} />}
      {searchText.length === 0 && currentPage === "root" && (
        <WindowsContainer />
      )}
      {searchText.length === 0 && currentPage === "saveAndRestore" && (
        <Box sx={{ p: 1 }}>
          <SaveAndRestorePage dense />
        </Box>
      )}
      {searchText.length === 0 && currentPage === "organization" && (
        <Box sx={{ p: 1 }}>
          <OrganizationPage dense />
        </Box>
      )}
    </Box>
  );
};

export default Home;
