import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { Divider, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

import ThemeProvider from "../../components/ThemeProvider";
import { ThemeContext } from "../../contexts/Theme";
import { useTheme } from "../../hooks/useTheme";

import Feedback from "./Feedback";
import Header from "./Header";
import Overview from "./Overview";
import Settings from "./Settings";
import WindowsProvider from "./WindowsProvider";

type Page = "Overview" | "Settings" | "Feedback";

export default function App() {
  const [currentPage, setPage] = useState<Page>("Overview");

  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <CssBaseline />
        <Header />

        <Stack sx={{ height: "100%" }} direction="row">
          <List
            sx={{
              height: "calc(100vh - 64px)",
              width: 240,
            }}
          >
            {["Overview", "Settings", "Feedback"].map((page: Page) => (
              <ListItem disablePadding>
                <ListItemButton
                  key={page}
                  selected={page === currentPage}
                  onClick={() => setPage(page)}
                >
                  <ListItemIcon>
                    {page === "Overview" && <ViewColumnIcon />}
                    {page === "Settings" && <SettingsIcon />}
                    {page === "Feedback" && <ForumIcon />}
                  </ListItemIcon>
                  <ListItemText primary={page} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider orientation="vertical" flexItem />

          {currentPage === "Overview" && (
            <WindowsProvider>
              <Overview />
            </WindowsProvider>
          )}
          {currentPage === "Settings" && (
            <Container sx={{ p: 2 }} maxWidth="md">
              <Settings />
            </Container>
          )}
          {currentPage === "Feedback" && (
            <Container sx={{ p: 2 }} maxWidth="md">
              <Feedback />
            </Container>
          )}
        </Stack>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
