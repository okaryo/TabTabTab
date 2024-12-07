import { ThemeProvider } from "@emotion/react";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ForumIcon from "@mui/icons-material/Forum";
import SettingsIcon from "@mui/icons-material/Settings";
import SyncIcon from "@mui/icons-material/Sync";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { createTheme } from "@mui/material/styles";
import type React from "react";
import { useContext, useState } from "react";
import t from "../../../i18n/Translations";
import { ModeContext, ModeProvider } from "../../contexts/ModeContext";
import {
  ThemeColorContext,
  ThemeColorProvider,
} from "../../contexts/ThemeColorContext";
import { WindowsProvider } from "../../contexts/WindowsContext";
import SaveAndRestorePage from "../shared/components/SaveAndRestorePage";
import TidyTabsPage from "../shared/components/TidyTabsPage";
import { tabGroupColorPalette } from "../shared/resources/tabGroupColorPalette";
import { themeColorPaletteBy } from "../shared/resources/themeColorPalette";
import Header from "./components/Header";
import Feedback from "./pages/Feedback";
import Overview from "./pages/Overview";
import Settings from "./pages/Settings";
import Sponsor from "./pages/Sponsor";

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useContext(ModeContext);
  const { themeColor } = useContext(ThemeColorContext);
  const themePalette = createTheme({
    palette: {
      mode,
      primary: themeColorPaletteBy(themeColor, mode),
      ...tabGroupColorPalette(mode),
    },
  });

  return <ThemeProvider theme={themePalette}>{children}</ThemeProvider>;
};

const App = () => {
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
      name: t.optionsNavigationSaveAndRestore,
      icon: <SyncIcon />,
      content: (
        <WindowsProvider>
          <Container sx={{ p: 2 }} maxWidth="md">
            <SaveAndRestorePage />
          </Container>
        </WindowsProvider>
      ),
    },
    {
      name: t.optionsNavigationTidyTabs,
      icon: <AutoAwesomeMotionIcon />,
      content: (
        <Container sx={{ py: 2, width: 700 }} fixed>
          <TidyTabsPage />
        </Container>
      ),
    },
    {
      name: t.optionsNavigationSettings,
      icon: <SettingsIcon />,
      content: (
        <Container sx={{ py: 2, width: 700 }} fixed>
          <Settings />
        </Container>
      ),
    },
    {
      name: t.optionsNavigationFeedback,
      icon: <ForumIcon />,
      content: (
        <Container sx={{ py: 2, width: 700 }} fixed>
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
    <ModeProvider>
      <ThemeColorProvider>
        <MuiThemeProvider>
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
                <ListItem key={page.name} disablePadding>
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
        </MuiThemeProvider>
      </ThemeColorProvider>
    </ModeProvider>
  );
};

export default App;
