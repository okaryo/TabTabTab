import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { PopupSize, defaultPopupSize } from "../../../../model/PopupSize";
import { getPopupSizeSetting } from "../../../../repository/SettingsRepository";
import OrganizationPage from "../../../components/OrganizationPage";
import RestorePage from "../../../components/RestorePage";
import StoredTabGroupsProvider from "../../../providers/StoredTabGroupsProvider";
import Header from "./Header";
import SearchResult from "./SearchResult";
import WindowsContainer from "./WindowsContainer";

export type PopupPage = "root" | "restore" | "organization";
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
      {searchText.length === 0 && currentPage === "restore" && (
        <Box sx={{ p: 1 }}>
          <StoredTabGroupsProvider>
            <RestorePage dense />
          </StoredTabGroupsProvider>
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
