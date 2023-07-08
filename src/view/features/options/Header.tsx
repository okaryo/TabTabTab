import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";

import t from "../../../i18n/Translations";
import { ThemeContext } from "../../contexts/Theme";
import { useToggleTheme } from "../../hooks/useToggleTheme";

type HeaderProps = {
  currentPage: "settings" | "feedback";
  setPage: (page: "settings" | "feedback") => void;
};

const Header = (props: HeaderProps) => {
  const { currentPage, setPage } = props;
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();

  const onClickTab = (
    _: React.SyntheticEvent,
    page: "settings" | "feedback",
  ) => {
    setPage(page);
  };

  return (
    <Box>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            TabTabTab
          </Typography>
          <IconButton
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
            color="inherit"
          >
            {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Tabs
        value={currentPage}
        onChange={onClickTab}
        sx={{ pr: 2, pl: 2, borderBottom: 1, borderColor: "divider" }}
        centered
      >
        <Tab
          style={{ textTransform: "none" }}
          label={t.settings}
          value="settings"
        />
        <Tab
          style={{ textTransform: "none" }}
          label={t.feedback}
          value="feedback"
        />
      </Tabs>
    </Box>
  );
};

export default Header;
