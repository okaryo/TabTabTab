import Stack from "@mui/material/Stack";
import React from "react";

import PopupSizeSettingForm from "./PopupSizeSettingForm";
import TabCleanerSettingForm from "./TabCleanerSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <TabCleanerSettingForm />
      <PopupSizeSettingForm />
    </Stack>
  );
};

export default Settings;
