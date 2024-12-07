import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import t from "../../../../../i18n/Translations";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";
import PopupElementScaleSettingForm from "./PopupElementScaleSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import ThemeColorSetting from "./ThemeColorSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <ThemeColorSetting />
      <PaperWithHeader header={t.popupSettingHeader}>
        <PopupSizeSettingForm />
        <Divider />
        <PopupElementScaleSettingForm />
      </PaperWithHeader>
    </Stack>
  );
};

export default Settings;
