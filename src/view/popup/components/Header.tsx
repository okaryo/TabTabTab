import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

import { navigateToOptionsPage } from "../../../repository/SettingsRepository";

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
