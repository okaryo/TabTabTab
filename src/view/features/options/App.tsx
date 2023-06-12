import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState } from "react";

import ThemeProvider from "../../components/ThemeProvider";
import { ThemeContext } from "../../contexts/Theme";
import { useTheme } from "../../hooks/useTheme";

import Feedback from "./Feedback";
import Header from "./Header";
import Settings from "./Settings";

type Page = "settings" | "feedback";

export default function App() {
  const [page, setPage] = useState<Page>("settings");

  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <CssBaseline />
        <Header currentPage={page} setPage={setPage} />

        <Container sx={{ p: 2 }} style={{ maxWidth: "680px" }}>
          {page === "settings" && <Settings />}
          {page === "feedback" && <Feedback />}
        </Container>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
