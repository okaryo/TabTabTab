import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import React, { useContext } from "react";

import t from "../../../../i18n/Translations";
import { navigateToOptionsPage } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/Theme";
import { useToggleTheme } from "../../../hooks/useToggleTheme";

type HeaderProps = {
  onChangeSearchText: (value: string) => void;
};

const Header = (props: HeaderProps) => {
  const { onChangeSearchText } = props;
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();
  const onInputSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeSearchText(event.target.value);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <TextField
          sx={{ mr: 2 }}
          placeholder={t.searchTabs}
          variant="standard"
          onChange={onInputSearchField}
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
