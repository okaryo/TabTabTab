import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useContext, useEffect, useState } from "react";
import { getToolbarSetting } from "../../../../../data/repository/SettingsRepository";
import { updateMode } from "../../../../../data/repository/ThemeRepository";
import t from "../../../../../i18n/Translations";
import type { Mode } from "../../../../../model/Theme";
import type { ToolbarSetting } from "../../../../../model/ToolbarSetting";
import { ModeContext } from "../../../../contexts/ModeContext";
import PaperWithHeader from "../PaperWithHeader";

const ModeSettingForm = () => {
  const { mode } = useContext(ModeContext);
  const [_settingState, setSettingState] = useState<ToolbarSetting>(null);

  const onChangeMode = async (
    _: React.MouseEvent<HTMLElement>,
    newMode: string,
  ) => {
    updateMode(newMode as Mode);
  };

  const items = [
    { value: "light", label: t.light, icon: <LightModeIcon sx={{ mr: 1 }} /> },
    {
      value: "system",
      label: t.system,
      icon: <SettingsBrightnessIcon sx={{ mr: 1 }} />,
    },
    { value: "dark", label: t.dark, icon: <DarkModeIcon sx={{ mr: 1 }} /> },
  ];

  useEffect(() => {
    const setSetting = async () => {
      const setting = await getToolbarSetting();
      setSettingState(setting);
    };
    setSetting();
  }, []);

  return (
    <PaperWithHeader header={t.mode}>
      <ToggleButtonGroup
        size="small"
        color="primary"
        value={mode}
        exclusive
        fullWidth
        sx={{ p: 2 }}
        style={{
          textTransform: "none",
        }}
        onChange={onChangeMode}
      >
        {items.map((item) => (
          <ToggleButton
            key={item.value}
            value={item.value}
            style={{ textTransform: "none" }}
          >
            {item.icon}
            {item.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </PaperWithHeader>
  );
};

export default ModeSettingForm;
