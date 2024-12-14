import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { useEffect, useState } from "react";
import { getToolbarSetting } from "../../../../../data/repository/SettingsRepository";
import {
  setToolbarIconBehaviorToOpenDashboard,
  setToolbarIconBehaviorToOpenDefaultPopup,
} from "../../../../../data/repository/ToolbarRepository";
import t from "../../../../../i18n/Translations";
import type { ToolbarSetting } from "../../../../../model/ToolbarSetting";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";

const ToolbarSettingForm = () => {
  const [settingState, setSettingState] = useState<ToolbarSetting>(null);

  const onChangeOpenDashboardWhenIconClicked = async () => {
    const newSetting = settingState.openDashboardWhenIconClicked
      ? await setToolbarIconBehaviorToOpenDefaultPopup()
      : await setToolbarIconBehaviorToOpenDashboard();

    setSettingState(newSetting);
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
        <ListItemButton
          sx={{ p: 2 }}
          onClick={onChangeOpenDashboardWhenIconClicked}
        >
          <ListItemText primary={t.toolbarIconClickBehaviorSettingHeader} />
          <Switch
            edge="end"
            checked={settingState.openDashboardWhenIconClicked}
          />
        </ListItemButton>
      )}
    </PaperWithHeader>
  );
};

export default ToolbarSettingForm;
