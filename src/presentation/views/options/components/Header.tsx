import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { updateMode } from "../../../../data/repository/ThemeRepository";
import t from "../../../../i18n/Translations";
import { ModeContext } from "../../../contexts/ModeContext";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

const SearchDialog = (props: SearchDialogProps) => {
  const { open, onClose } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      dialog
    </Dialog>
  );
};

const Header = () => {
  const theme = useTheme();
  const { mode } = useContext(ModeContext);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        setOpenSearchDialog(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          TabTabTab
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SearchIcon />}
            endIcon={
              <Chip
                style={{
                  borderRadius: 8,
                  fontWeight: "bold",
                  marginLeft: theme.spacing(2),
                  color: "inherit",
                }}
                label="/"
                component="kbd"
                variant="outlined"
                size="small"
              />
            }
            sx={{
              textTransform: "none",
              color: "inherit",
              borderColor: theme.palette.divider,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              transition: "border-color 0.2s",
            }}
            onClick={() => setOpenSearchDialog(true)}
          >
            {t.searchTabs}
          </Button>
          <SearchDialog
            open={openSearchDialog}
            onClose={() => setOpenSearchDialog(false)}
          />

          <IconButton
            onClick={() => updateMode(mode === "light" ? "dark" : "light")}
            color="inherit"
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
