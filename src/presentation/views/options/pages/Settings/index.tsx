import Stack from "@mui/material/Stack";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import ThemeColorSettingForm from "./ThemeColorSettingForm";
import ToolbarSettingForm from "./ToolbarSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <ThemeColorSettingForm />
      <PopupSizeSettingForm />
      <ToolbarSettingForm />
    </Stack>
  );
};

export default Settings;
