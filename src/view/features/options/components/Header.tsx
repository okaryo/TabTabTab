import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { updateMode } from "../../../../data/repository/ThemeRepository";
import { ModeContext } from "../../../contexts/ModeContext";

const Header = () => {
  const { mode } = useContext(ModeContext);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          TabTabTab
        </Typography>
        <IconButton
          onClick={() => updateMode(mode === "light" ? "dark" : "light")}
          color="inherit"
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
