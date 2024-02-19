/* eslint @typescript-eslint/no-floating-promises: 0 */

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";

import { TabGroupSetting } from "../../../model/TabGroupSetting";
import {
  addListenerOnUpdateTabGroupSetting,
  getTabGroupSetting,
  removeListenerOnUpdateTabGroupSetting,
  updateTabGroupSetting,
} from "../../../repository/TabGroupSettingRepository";

const AutoGroupPage = () => {
  const [setting, setSetting] = useState<TabGroupSetting>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const initialSetting = await getTabGroupSetting();
      setSetting(initialSetting);
    };
    fetchSettings();

    const listener = addListenerOnUpdateTabGroupSetting((newSetting) => {
      setSetting(newSetting);
    });

    return () => {
      removeListenerOnUpdateTabGroupSetting(listener);
    };
  }, []);

  const onChangeSwitch = (key: keyof TabGroupSetting) => {
    const newSetting = { ...setting, [key]: !setting[key] };
    updateSetting(newSetting);
  };
  const onChangeGroupBySelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSetting = {
      ...setting,
      groupBy: event.target.value as "domain" | "subdomain",
    };
    updateSetting(newSetting);
  };
  const updateSetting = (setting: TabGroupSetting) => {
    setSetting(setting);
    updateTabGroupSetting(setting);
  };

  return (
    <Paper variant="outlined">
      {setting && (
        <>
          <List>
            <ListItem>
              <ListItemText
                id="switch-list-label-wifi"
                primary="Group Tabs Manually"
              />
              <Button
                variant="contained"
                disableElevation
                sx={{
                  textTransform: "none",
                }}
              >
                Group Now
              </Button>
            </ListItem>
            <ListItemButton
              onClick={() => onChangeSwitch("enabledAutoGrouping")}
            >
              <ListItemText
                id="switch-list-label-wifi"
                primary="Group Tabs Automatically"
              />
              <Switch edge="end" checked={setting.enabledAutoGrouping} />
            </ListItemButton>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Grouping Settings</ListSubheader>}>
            <ListItemButton
              onClick={() => onChangeSwitch("collapseWhenNoInUse")}
            >
              <ListItemText primary="Collapse Group When Not in Use" />
              <Switch edge="end" checked={setting.collapseWhenNoInUse} />
            </ListItemButton>
            <ListItemButton
              onClick={() => onChangeSwitch("ungroupSingleTabGroups")}
            >
              <ListItemText primary="Close Single Tabs Group" />
              <Switch edge="end" checked={setting.ungroupSingleTabGroups} />
            </ListItemButton>
            <ListItem>
              <ListItemText primary="Group Tabs By" />
              <FormControl size="small">
                <Select
                  value={setting.groupBy}
                  placeholder={setting.groupBy}
                  onChange={onChangeGroupBySelect}
                >
                  <MenuItem value="domain">Domain</MenuItem>
                  <MenuItem value="subdomain">Subdomain</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </>
      )}
    </Paper>
  );
};

export default AutoGroupPage;
