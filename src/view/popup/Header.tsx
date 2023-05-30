import React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { navigateToOptionsPage } from "../../repository/SettingsRepository";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

const Header = () => (
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
      <IconButton onClick={() => navigateToOptionsPage()} color="inherit">
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
);

export default Header;
