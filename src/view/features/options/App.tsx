import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

import ThemeProvider from "../../components/ThemeProvider";
import { ThemeContext } from "../../contexts/Theme";
import { useTheme } from "../../hooks/useTheme";

import Settings from "./Settings";

export default function App() {
  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Settings
            </Typography>
          </Toolbar>
        </AppBar>

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
