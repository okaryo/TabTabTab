import React from "react";
import TabCleanerSettingForm from "./TabCleanerSettingForm";
import { Divider, Stack } from "@mui/material";
import Footer from "./Footer";
import PopupSizeSettingForm from "./PopupSizeSettingForm";

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
