import Stack from "@mui/material/Stack";

import TabCleanerSettingForm from "./TabCleanerForm";
import TabGroupingForm from "./TabGroupingForm";

const OrganizationPage = () => {
  return (
    <Stack spacing={4}>
      <TabGroupingForm />
      <TabCleanerSettingForm />
    </Stack>
  );
};

export default OrganizationPage;
