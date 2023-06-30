import Stack from "@mui/material/Stack";
import React from "react";

import PopupElementScaleSettingForm from "./PopupElementScaleSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import TabCleanerSettingForm from "./TabCleanerSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <TabCleanerSettingForm />
      <PopupSizeSettingForm />
      <PopupElementScaleSettingForm />
    </Stack>
  );
};

export default Settings;
