import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useState } from "react";

import t from "../../../../../i18n/Translations";

import SavedTabGroups from "./StoredTabGroups";
import SavedWindows from "./StoredWindows";

type Page = "window" | "tabGroup";

const Restore = () => {
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
    <Stack sx={{ height: "100%" }} spacing={2}>
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
      {currentPage === "window" && <SavedWindows />}
      {currentPage === "tabGroup" && <SavedTabGroups />}
    </Stack>
  );
};

export default Restore;
