import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncIcon from "@mui/icons-material/Sync";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { Divider, Stack } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

import t from "../../../i18n/Translations";
import RestorePage from "../../components/RestorePage";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useTheme } from "../../hooks/useTheme";
import ThemeProvider from "../../providers/ThemeProvider";

import Header from "./components/Header";
import WindowsProvider from "./components/WindowsProvider";
import Feedback from "./pages/Feedback";
import Overview from "./pages/Overview";
import Settings from "./pages/Settings";
import Sponsor from "./pages/Sponsor";

export default function App() {
  const [currentPage, setPage] = useState(0);
  const pages = [
    {
      name: t.optionsNavigationAllWindows,
      icon: <ViewColumnIcon />,
      content: (
        <WindowsProvider>
          <Overview />
        </WindowsProvider>
      ),
    },
    {
      name: t.optionsNavigationRestore,
      icon: <SyncIcon />,
      content: (
        <Container sx={{ p: 2 }} maxWidth="md">
          <RestorePage />
        </Container>
      ),
    },
    {
      name: t.optionsNavigationSettings,
      icon: <SettingsIcon />,
      content: (
        <Container sx={{ p: 2 }} maxWidth="md">
          <Settings />
        </Container>
      ),
    },
    {
      name: t.optionsNavigationFeedback,
      icon: <ForumIcon />,
      content: (
        <Container sx={{ p: 2 }} maxWidth="md">
          <Feedback />
        </Container>
      ),
    },
    {
      name: t.optionsNavigationSponsor,
      icon: <VolunteerActivismIcon />,
      content: (
        <Container maxWidth="md">
          <Sponsor />
        </Container>
      ),
    },
  ];

  return (
    <ThemeContext.Provider value={useTheme()}>
      <ThemeProvider>
        <CssBaseline />
        <Header />

        <Stack sx={{ height: "100%" }} direction="row">
          <List
            sx={{
              height: "calc(100vh - 64px)",
              flexShrink: 0,
            }}
          >
            {pages.map((page, index) => (
              <ListItem disablePadding>
                <ListItemButton
                  key={page.name}
                  sx={{ py: 1, pl: 2, pr: 6 }}
                  selected={currentPage === index}
                  onClick={() => setPage(index)}
                >
                  <ListItemIcon>{page.icon}</ListItemIcon>
                  <ListItemText primary={page.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider orientation="vertical" flexItem />
          {pages[currentPage].content}
        </Stack>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
