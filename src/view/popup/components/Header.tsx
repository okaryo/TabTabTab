import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";

import { navigateToOptionsPage } from "../../../repository/SettingsRepository";
import { ThemeContext } from "../contexts/Theme";
import { useToggleTheme } from "../hooks/useToggleTheme";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          style={{ color: "white" }}
          variant="h6"
          component="h1"
          sx={{ flexGrow: 1 }}
        >
          TabTabTab
        </Typography>
        <IconButton
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
          color="inherit"
        >
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton onClick={() => navigateToOptionsPage()} color="inherit">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
