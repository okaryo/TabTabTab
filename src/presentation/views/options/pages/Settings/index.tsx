import Stack from "@mui/material/Stack";
import t from "../../../../../i18n/Translations";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";
import PopupSizeSettingForm from "./PopupSizeSettingForm";
import ThemeColorSettingForm from "./ThemeColorSettingForm";
import ToolbarSettingForm from "./ToolbarSettingForm";

const Settings = () => {
  return (
    <Stack spacing={2}>
      <ThemeColorSettingForm />
      <PaperWithHeader header={t.popupSettingHeader}>
        <PopupSizeSettingForm />
      </PaperWithHeader>
      <ToolbarSettingForm />
    </Stack>
  );
};

export default Settings;
