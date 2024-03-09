import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import {
  addListenerOnChangeTabGroupSetting,
  getTabGroupSetting,
  groupTabsBySetting,
  removeListenerOnChangeTabGroupSetting,
  updateTabGroupSetting,
} from "../../../data/repository/TabGroupSettingRepository";
import t from "../../../i18n/Translations";
import { TabGroupSetting } from "../../../model/TabGroupSetting";
import PaperWithHeader from "../PaperWithHeader";

type TabGroupingFormProps = {
  dense: boolean;
};

const TabGroupingForm = (props: TabGroupingFormProps) => {
  const { dense } = props;
  const [setting, setSetting] = useState<TabGroupSetting>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const initialSetting = await getTabGroupSetting();
      setSetting(initialSetting);
    };
    fetchSettings();

    const listener = addListenerOnChangeTabGroupSetting((newSetting) => {
      setSetting(newSetting);
    });

    return () => {
      removeListenerOnChangeTabGroupSetting(listener);
    };
  }, []);

  const onChangeSwitch = (key: keyof TabGroupSetting) => {
    const newSetting = { ...setting, [key]: !setting[key] };
    if (key === "enabledAutoGrouping" && newSetting[key]) {
      groupTabsBySetting(newSetting);
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
    <PaperWithHeader header={t.tabGroupingHeader}>
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
                onClick={() => groupTabsBySetting(setting)}
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
              <ListItemText primary={t.tabGroupingAutoUngroupSingleTabGroups} />
              <Switch edge="end" checked={setting.ungroupSingleTabGroups} />
            </ListItemButton>
            <ListItemButton
              onClick={() =>
                onChangeSwitch("applyAutoGroupingToCurrentTabOnly")
              }
            >
              <ListItemText
                primary={t.tabGroupingApplyAutoGroupingToCurrentTabOnly}
                secondary={
                  t.tabGroupingApplyAutoGroupingToCurrentTabOnlyDescription
                }
              />
              <Switch
                edge="end"
                checked={setting.applyAutoGroupingToCurrentTabOnly}
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
    </PaperWithHeader>
  );
};

export default TabGroupingForm;
