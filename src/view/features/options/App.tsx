import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

import ThemeProvider from "../../components/ThemeProvider";
import { ThemeContext } from "../../contexts/Theme";
import { useTheme } from "../../hooks/useTheme";

import Header from "./Header";
import Settings from "./Settings";

export default function App() {
  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <CssBaseline />
        <Header />

        <Container sx={{ p: 2 }} style={{ maxWidth: "680px" }}>
          <Settings />
        </Container>

        <style>
          {`
          html, body {
            padding: 0;
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
        `}{" "}
        </style>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
