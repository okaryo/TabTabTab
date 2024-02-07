import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";

import t from "../../../i18n/Translations";
import StoredTabGroupsProvider from "../../features/options/components/StoredTabGroupsProvider";

import StoredTabGroups from "./StoredTabGroups";
import StoredWindows from "./StoredWindows";

type Page = "window" | "tabGroup";

type RestorePageProps = {
  dense?: boolean;
};

const RestorePage = (props: RestorePageProps) => {
  const { dense = false } = props;
  const [currentPage, setCurrentPage] = useState<Page>("tabGroup");
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

  return (
    <Stack sx={{ height: "100%" }} spacing={dense ? 1 : 2}>
      <ToggleButtonGroup
        fullWidth
        exclusive
        value={currentPage}
        color="primary"
        onChange={(_, value: Page) => setCurrentPage(value)}
      >
        {pages.map((page) => (
          <ToggleButton value={page.value} style={{ textTransform: "none" }}>
            {page.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {currentPage === "window" && <StoredWindows />}
      {currentPage === "tabGroup" && (
        <StoredTabGroupsProvider>
          <StoredTabGroups dense={dense} />
        </StoredTabGroupsProvider>
      )}
    </Stack>
  );
};

export default RestorePage;
