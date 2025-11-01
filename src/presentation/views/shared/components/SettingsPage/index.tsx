import Stack from "@mui/material/Stack";
import ModeSettingForm from "./ModeSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import ThemeColorSettingForm from "./ThemeColorSettingForm";
import ToolbarSettingForm from "./ToolbarSettingForm";

const SettingsPage = () => {
  return (
    <Stack spacing={1}>
      <ModeSettingForm />
      <ThemeColorSettingForm />
      <PopupSizeSettingForm />
      <ToolbarSettingForm />
    </Stack>
  );
};

export default SettingsPage;
