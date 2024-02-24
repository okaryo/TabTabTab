/* eslint @typescript-eslint/no-floating-promises: 0, @typescript-eslint/no-misused-promises: 0 */

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
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
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import t from "../../../i18n/Translations";
import { TabGroupSetting } from "../../../model/TabGroupSetting";
import {
  addListenerOnUpdateTabGroupSetting,
  getTabGroupSetting,
  removeListenerOnUpdateTabGroupSetting,
  updateTabGroupSetting,
} from "../../../repository/TabGroupSettingRepository";
import { useGroupTabsNow } from "../../hooks/useGroupTabsNow";

type TabGroupingFormProps = {
  dense: boolean;
};

const TabGroupingForm = (props: TabGroupingFormProps) => {
  const { dense } = props;
  const [setting, setSetting] = useState<TabGroupSetting>(null);
  const groupTabsNow = useGroupTabsNow();

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
    if (key === "enabledAutoGrouping" && newSetting[key]) {
      groupTabsNow(newSetting);
    }
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
    <Stack spacing={1}>
      <Paper variant="outlined">
        <ListItem
          sx={[
            {
              backgroundColor: grey[100],
            },
            (theme) =>
              theme.applyStyles("dark", {
                backgroundColor: alpha(grey[800], 0.4),
              }),
          ]}
        >
          <ListItemText
            primary={
              <Typography variant="subtitle1">{t.tabGroupingHeader}</Typography>
            }
          />
        </ListItem>
        <Divider />
        {setting && (
          <>
            <List dense={dense}>
              <Box sx={{ py: 1, px: 2 }}>
                <Button
                  variant="contained"
                  disableElevation
                  fullWidth
                  sx={{
                    textTransform: "none",
                  }}
                  onClick={() => groupTabsNow(setting)}
                >
                  {t.tabGroupingGroupTabsNow}
                </Button>
              </Box>
              <ListItemButton
                onClick={() => onChangeSwitch("enabledAutoGrouping")}
              >
                <ListItemText primary={t.tabGroupingGroupTabsAutomatically} />
                <Switch edge="end" checked={setting.enabledAutoGrouping} />
              </ListItemButton>
            </List>
            <List
              dense={dense}
              subheader={
                <ListSubheader>
                  {t.tabGroupingDetailSettingsSubheader}
                </ListSubheader>
              }
            >
              <ListItemButton
                onClick={() => onChangeSwitch("collapseWhenNoInUse")}
              >
                <ListItemText
                  primary={t.tabGroupingAutoCollapseUnusedTabGroups}
                />
                <Switch edge="end" checked={setting.collapseWhenNoInUse} />
              </ListItemButton>
              <ListItemButton
                onClick={() => onChangeSwitch("ungroupSingleTabGroups")}
              >
                <ListItemText
                  primary={t.tabGroupingAutoUngroupSingleTabGroups}
                />
                <Switch edge="end" checked={setting.ungroupSingleTabGroups} />
              </ListItemButton>
              <ListItemButton
                onClick={() =>
                  onChangeSwitch("limitAutoGroupingTargetToActiveTab")
                }
              >
                <ListItemText primary={t.tabGroupingLimitTargetToActiveTab} />
                <Switch
                  edge="end"
                  checked={setting.limitAutoGroupingTargetToActiveTab}
                />
              </ListItemButton>
              <ListItem>
                <ListItemText primary={t.tabGroupingGroupTabsBy} />
                <FormControl size="small">
                  <Select
                    value={setting.groupBy}
                    placeholder={setting.groupBy}
                    onChange={onChangeGroupBySelect}
                  >
                    <MenuItem value="domain">
                      {t.tabGroupingGroupTabsByMenuItemDomain}
                    </MenuItem>
                    <MenuItem value="subdomain">
                      {t.tabGroupingGroupTabsByMenuItemSubdomain}
                    </MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </>
        )}
      </Paper>
    </Stack>
  );
};

export default TabGroupingForm;
