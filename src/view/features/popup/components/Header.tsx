import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import React, { Dispatch, SetStateAction, useContext } from "react";

import t from "../../../../i18n/Translations";
import { navigateToOptionsPage } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/Theme";
import { useToggleTheme } from "../../../hooks/useToggleTheme";

const Header = (props: { onChange: Dispatch<SetStateAction<string>> }) => {
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();
  const onHoge = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <TextField
          sx={{ mr: 2 }}
          placeholder={t.searchTabs}
          variant="standard"
          onChange={onHoge}
          autoFocus
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
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
