import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import { getToolbarSetting } from "../../../../../data/repository/SettingsRepository";
import { setToolbarIconClickOpenView } from "../../../../../data/repository/ToolbarRepository";
import t from "../../../../../i18n/Translations";
import {
  isValidIconClickOpenView,
  type ToolbarSetting,
} from "../../../../../model/ToolbarSetting";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";

const ToolbarSettingForm = () => {
  const [settingState, setSettingState] = useState<ToolbarSetting>(null);

  const onChangeIconClickOpenView = async (
    event: SelectChangeEvent<string>,
  ) => {
    const value = event.target.value;
    if (isValidIconClickOpenView(value)) {
      const newSetting = await setToolbarIconClickOpenView(value);
      setSettingState(newSetting);
    }
  };

  useEffect(() => {
    const setSetting = async () => {
      const setting = await getToolbarSetting();
      setSettingState(setting);
    };
    setSetting();
  }, []);

  return (
    <PaperWithHeader header={t.toolbarSettingHeader}>
      {settingState && (
        <ListItem sx={{ p: 2 }}>
          <ListItemText primary={t.toolbarIconClickBehaviorSettingHeader} />
          <Select
            value={settingState.iconClickOpenView}
            onChange={onChangeIconClickOpenView}
          >
            <MenuItem value="popup">
              {t.toolbarIconClickBehaviorSelectPopup}
            </MenuItem>
            <MenuItem value="sidePanel">
              {t.toolbarIconClickBehaviorSelectSidePanel}
            </MenuItem>
            <MenuItem value="dashboard">
              {t.toolbarIconClickBehaviorSelectDashboard}
            </MenuItem>
          </Select>
        </ListItem>
      )}
    </PaperWithHeader>
  );
};

export default ToolbarSettingForm;
