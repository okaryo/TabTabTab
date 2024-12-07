import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";
import t from "../../../../../i18n/Translations";
import { StoredTabGroupsProvider } from "../../../../contexts/StoredTabGroupsContext";
import { StoredWindowsProvider } from "../../../../contexts/StoredWindowsContext";
import StoredTabGroups from "./StoredTabGroups";
import StoredWindows from "./StoredWindows";

type Page = "window" | "tabGroup";

type SaveAndRestorePageProps = {
  dense?: boolean;
};

const SaveAndRestorePage = (props: SaveAndRestorePageProps) => {
  const { dense = false } = props;
  const [currentPage, setCurrentPage] = useState<Page>("window");
  const pages = [
    {
      value: "window",
      label: t.window,
    },
    {
      value: "tabGroup",
      label: t.tabGroup,
    },
  ];

  const onChangePage = (_: React.MouseEvent<HTMLElement>, page: Page) => {
    if (page === null) return;
    setCurrentPage(page);
  };

  return (
    <Stack sx={{ height: "100%" }} spacing={dense ? 1 : 2}>
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={currentPage}
        color="primary"
        onChange={onChangePage}
      >
        {pages.map((page) => (
          <ToggleButton
            key={page.value}
            value={page.value}
            style={{ textTransform: "none" }}
          >
            {page.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {currentPage === "window" && (
        <StoredWindowsProvider>
          <StoredWindows dense={dense} />
        </StoredWindowsProvider>
      )}
      {currentPage === "tabGroup" && (
        <StoredTabGroupsProvider>
          <StoredTabGroups dense={dense} />
        </StoredTabGroupsProvider>
      )}
    </Stack>
  );
};

export default SaveAndRestorePage;
