import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import { ThemeContext } from "../../../contexts/ThemeContext";
import { useToggleTheme } from "../../../hooks/useToggleTheme";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const toggleTheme = useToggleTheme();

  return (
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
  );
};

export default Header;
