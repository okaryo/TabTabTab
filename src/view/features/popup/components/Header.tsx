import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import ClearIcon from "@mui/icons-material/Clear";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import { updateMode } from "../../../../data/repository/ThemeRepository";
import t from "../../../../i18n/Translations";
import { PopupHeaderActionMenu } from "../../../components/ActionMenu";
import { ModeContext } from "../../../contexts/ModeContext";
import type { PopupPage } from "./Home";

type HeaderProps = {
  sidePanel: boolean;
  currentPage: PopupPage;
  searchText: string;
  setCurrentPage: (page: PopupPage) => void;
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
  const { sidePanel, currentPage, searchText, setCurrentPage, setSearchText } =
    props;
  const { mode } = useContext(ModeContext);

  const onInputSearchField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  const onClearSearchText = () => {
    setSearchText("");
  };

  const BasicIcons = () => {
    const [menuAnchorElement, setMenuAnchorElement] =
      useState<HTMLElement | null>(null);
    const onClickActionMenu = (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchorElement(event.currentTarget);
    };
    const onCloseMenu = () => setMenuAnchorElement(null);

    return (
      <>
        <IconButton
          color="inherit"
          onClick={() => updateMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        <IconButton color="inherit" onClick={onClickActionMenu}>
          <MoreVertIcon />
        </IconButton>
        <PopupHeaderActionMenu
          isOpenMenu={Boolean(menuAnchorElement)}
          anchorElement={menuAnchorElement}
          onCloseMenu={onCloseMenu}
          sidePanel={sidePanel}
        />
      </>
    );
  };

  if (["restore", "organization"].includes(currentPage)) {
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
            {currentPage === "restore" && t.optionsNavigationRestore}
            {currentPage === "organization" && t.optionsNavigationOrganization}
          </Typography>
          <BasicIcons />
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
          <>
            <IconButton
              onClick={() => setCurrentPage("organization")}
              color="inherit"
            >
              <AutoAwesomeMotionIcon />
            </IconButton>
            <IconButton
              onClick={() => setCurrentPage("restore")}
              color="inherit"
            >
              <SyncIcon />
            </IconButton>
          </>
        )}
        <BasicIcons />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
