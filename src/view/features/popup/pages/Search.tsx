import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";

import t from "../../../../i18n/Translations";
import TabItem from "../components/TabItem";
import { WindowsContext } from "../contexts/Windows";
import { useNavigatePage } from "../hooks/useNavigatePage";

const Search = () => {
  const { windows } = useContext(WindowsContext);
  const [searchText, setSearchText] = React.useState("");
  const tabs = windows.findTabsByTitleOrUrl(searchText);
  const navigatePage = useNavigatePage();
  const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={() => navigatePage("home")} color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <TextField
            sx={{ ml: 2 }}
            placeholder={t.searchTabs}
            variant="standard"
            onChange={onChangeSearchText}
            autoFocus
            fullWidth
          />
        </Toolbar>
      </AppBar>
      {tabs.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ ml: 2, textAlign: "center" }}
          >
            {t.noResultsFound}
          </Typography>
        </Box>
      )}
      {tabs.length > 0 && (
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          disablePadding
        >
          {tabs.map((tab) => (
            <TabItem key={tab.id.value} tab={tab} />
          ))}
        </List>
      )}
    </>
  );
};

export default Search;
