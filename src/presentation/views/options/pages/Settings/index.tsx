import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import t from "../../../../../i18n/Translations";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";
import PopupElementScaleSettingForm from "./PopupElementScaleSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import ThemeColorSettingForm from "./ThemeColorSettingForm";
import ToolbarSettingForm from "./ToolbarSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <ThemeColorSettingForm />
      <PaperWithHeader header={t.popupSettingHeader}>
        <PopupSizeSettingForm />
        <Divider />
        <PopupElementScaleSettingForm />
      </PaperWithHeader>
      <ToolbarSettingForm />
    </Stack>
  );
};

export default Settings;
