import Divider from "@mui/material/Divider";

import t from "../../../../../i18n/Translations";
import PaperWithHeader from "../../../../components/PaperWithHeader";

import PopupElementScaleSettingForm from "./PopupElementScaleSettingForm";
import PopupSizeSettingForm from "./PopupSizeSettingForm";

const Settings = () => {
  return (
    <PaperWithHeader header={t.popupSettingHeader}>
      <PopupSizeSettingForm />
      <Divider />
      <PopupElementScaleSettingForm />
    </PaperWithHeader>
  );
};

export default Settings;
