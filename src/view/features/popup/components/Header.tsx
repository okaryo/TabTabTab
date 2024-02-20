/* eslint @typescript-eslint/no-misused-promises: 0 */

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SyncIcon from "@mui/icons-material/Sync";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import t from "../../../../i18n/Translations";
import { navigateToOptionsPage } from "../../../../repository/SettingsRepository";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useToggleTheme } from "../../../hooks/useToggleTheme";

type HeaderProps = {
  currentPage: "root" | "restore";
  searchText: string;
  setCurrentPage: (page: "root" | "restore") => void;
  setSearchText: (value: string) => void;
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const Header = (props: HeaderProps) => {
  const { currentPage, searchText, setCurrentPage, setSearchText } = props;
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();

  const onInputSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const onClearSearchText = () => {
    setSearchText("");
  };

  if (currentPage === "restore") {
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            sx={{ mr: 1 }}
            color="inherit"
            onClick={() => setCurrentPage("root")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t.optionsNavigationRestore}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={() => navigateToOptionsPage()}>
            <SpaceDashboardIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t.searchTabs}
            value={searchText}
            onChange={onInputSearchField}
            autoFocus
            fullWidth
            endAdornment={
              searchText && (
                <InputAdornment sx={{ color: "inherit" }} position="end">
                  <IconButton color="inherit" onClick={onClearSearchText}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }
          />
        </Search>
        {searchText.length === 0 && (
          <IconButton onClick={() => setCurrentPage("restore")} color="inherit">
            <SyncIcon />
          </IconButton>
        )}
        <IconButton
          color="inherit"
          onClick={() => toggleTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton color="inherit" onClick={() => navigateToOptionsPage()}>
          <SpaceDashboardIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
