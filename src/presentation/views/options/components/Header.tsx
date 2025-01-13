import ClearIcon from "@mui/icons-material/Clear";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { getRecentActiveTabs } from "../../../../data/repository/TabsRepository";
import { updateMode } from "../../../../data/repository/ThemeRepository";
import t from "../../../../i18n/Translations";
import type { Tab } from "../../../../model/Tab";
import { ModeContext } from "../../../contexts/ModeContext";
import TabItem from "../../shared/components/TabItem";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

const RecentActiveTabs = ({ tabs }: { tabs: Tab[] }) => {
  return (
    <List
      sx={{ width: "100%", overflowY: "auto" }}
      disablePadding
      subheader={
        <ListSubheader
          component="div"
          disableGutters
          color="primary"
          style={{ backgroundColor: "transparent" }}
        >
          {t.recentActiveTabsHeader}
        </ListSubheader>
      }
    >
      <Paper variant="outlined" style={{ overflow: "hidden" }}>
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            selected={false}
            showDragIndicatorIcon={false}
            showActions={false}
            showDuplicatedChip={false}
          />
        ))}
      </Paper>
    </List>
  );
};

const SearchDialog = (props: SearchDialogProps) => {
  const { open, onClose } = props;
  const _theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [recentActiveTabs, setRecentActiveTabs] = useState<Tab[]>(null);

  useEffect(() => {
    const initializeState = async () => {
      const tabs = await getRecentActiveTabs();
      setRecentActiveTabs(tabs);
    };
    initializeState();
  }, []);

  return (
    <Dialog sx={{ maxHeight: 600 }} fullWidth open={open} onClose={onClose}>
      <Container maxWidth="sm" sx={{ p: 2 }} disableGutters>
        <Stack>
          <TextField
            placeholder={t.searchTabs}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            fullWidth
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchText("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {!searchText && recentActiveTabs && recentActiveTabs.length > 0 && (
            <RecentActiveTabs tabs={recentActiveTabs} />
          )}
        </Stack>
      </Container>
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
                  marginLeft: theme.spacing(4),
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
