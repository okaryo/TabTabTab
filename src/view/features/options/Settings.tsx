import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import React from "react";

import Footer from "./Footer";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import TabCleanerSettingForm from "./TabCleanerSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <TabCleanerSettingForm />
      <PopupSizeSettingForm />
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Footer />
    </Stack>
  );
};

export default Settings;
