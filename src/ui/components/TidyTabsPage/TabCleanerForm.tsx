import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import {
  addListenerOnChangeTabCleanerSetting,
  getTabCleanerSetting,
  updateTabCleanerSetting,
} from "../../../data/repository/TabCleanerRepository";
import { removeListenerOnChangeTabGroupSetting } from "../../../data/repository/TabGroupSettingRepository";
import t from "../../../i18n/Translations";
import type { DurationUnit, TabCleaner } from "../../../model/TabCleaner";
import PaperWithHeader from "../PaperWithHeader";

type TabCleanerFormProps = {
  dense: boolean;
};
type DurationErrorState = {
  isError: boolean;
  errorMessage: string;
};

const TabCleanerForm = (props: TabCleanerFormProps) => {
  const { dense } = props;
  const [setting, setSetting] = useState<TabCleaner>(null);
  const [inputDuration, setInputDuration] = useState("");
  const [durationError, setDurationError] = useState<DurationErrorState>({
    isError: false,
    errorMessage: "",
  });

  useEffect(() => {
    const setInitialSetting = async () => {
      const initialSetting = await getTabCleanerSetting();
      setSetting(initialSetting);
      setInputDuration(String(initialSetting.duration));
    };
    setInitialSetting();

    const listenerOnChange = addListenerOnChangeTabCleanerSetting(
      (newValue: TabCleaner) => setSetting(newValue),
    );

    return () => removeListenerOnChangeTabGroupSetting(listenerOnChange);
  }, []);

  const validateDurationValue = (value: string): DurationErrorState => {
    if (!Number.isInteger(Number(value)) || Number(value) <= 0) {
      return {
        isError: true,
        errorMessage: t.tabCleanerValidationErrorValueFormat,
      };
    }

    return { isError: false, errorMessage: "" };
  };

  const onChangeIsEnabled = () => {
    const newSetting = { ...setting, enabled: !setting.enabled };
    updateTabCleanerSetting(newSetting);
  };
  const onChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputDuration(value);

    const validationResult = validateDurationValue(value);
    setDurationError(validationResult);
    if (validationResult.isError) return;

    const newSetting = { ...setting, duration: Number(value) };
    updateTabCleanerSetting(newSetting);
  };
  const onChangeDurationUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSetting = {
      ...setting,
      durationUnit: event.target.value as DurationUnit,
    };
    updateTabCleanerSetting(newSetting);
  };

  return (
    <PaperWithHeader header={t.cleanupTabsHeader}>
      {setting && (
        <List dense={dense}>
          <ListItemButton onClick={onChangeIsEnabled}>
            <ListItemText
              primary={t.tabCleanerHeader}
              secondary={t.tabCleanerDescription}
            />
            <Switch edge="end" checked={setting.enabled} />
          </ListItemButton>
          <ListItem>
            <Stack direction="row" spacing={2}>
              <TextField
                value={inputDuration}
                variant="outlined"
                size="small"
                label={t.duration}
                disabled={!setting.enabled}
                onChange={onChangeDuration}
                error={durationError.isError}
                helperText={durationError.errorMessage}
              />
              <FormControl
                size="small"
                sx={{ minWidth: 120 }}
                disabled={!setting.enabled}
              >
                <InputLabel>{t.unit}</InputLabel>
                <Select
                  value={setting.durationUnit}
                  label={t.unit}
                  onChange={onChangeDurationUnit}
                >
                  <MenuItem value={"day"}>{t.durationUnitDay}</MenuItem>
                  <MenuItem value={"hour"}>{t.durationUnitHour}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </ListItem>
        </List>
      )}
    </PaperWithHeader>
  );
};

export default TabCleanerForm;
