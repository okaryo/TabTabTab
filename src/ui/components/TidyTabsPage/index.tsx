import Stack from "@mui/material/Stack";
import TabCleanerSettingForm from "./TabCleanerForm";
import TabGroupingForm from "./TabGroupingForm";

type TidyTabsPageProps = {
  dense?: boolean;
};

const TidyTabsPage = (props: TidyTabsPageProps) => {
  const { dense = false } = props;

  return (
    <Stack spacing={dense ? 1 : 2}>
      <TabGroupingForm dense={dense} />
      <TabCleanerSettingForm dense={dense} />
    </Stack>
  );
};

export default TidyTabsPage;
