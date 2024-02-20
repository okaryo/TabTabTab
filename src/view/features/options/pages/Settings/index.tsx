import Stack from "@mui/material/Stack";

import PopupElementScaleSettingForm from "./PopupElementScaleSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <PopupSizeSettingForm />
      <PopupElementScaleSettingForm />
    </Stack>
  );
};

export default Settings;
