import Stack from "@mui/material/Stack";
import TabCleanerSettingForm from "./TabCleanerForm";
import TabGroupingForm from "./TabGroupingForm";

const TidyTabsPage = () => {
  return (
    <Stack spacing={1}>
      <TabGroupingForm />
      <TabCleanerSettingForm />
    </Stack>
  );
};

export default TidyTabsPage;
