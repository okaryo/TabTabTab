import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import t from "../../../i18n/Translations";
import { TabCleaner, DurationUnit } from "../../../model/settings/TabCleaner";
import {
  getTabCleanerSetting,
  updateTabCleanerSetting,
} from "../../../repository/SettingsRepository";

type SettingForm = {
  isEnabled: boolean;
  duration: string;
  durationUnit: DurationUnit;
};
type SubmissionState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};
type DurationErrorState = Omit<SubmissionState, "isLoading">;

const TabCleanerSettingForm = () => {
  const [settingState, setSettingState] = useState<SettingForm>({
    isEnabled: false,
    duration: "5",
    durationUnit: "day",
  });
  const [durationErrorState, setDurationErrorState] =
    useState<DurationErrorState>({ isError: false, errorMessage: "" });
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    isError: false,
    errorMessage: "",
  });
  const [isOpenSnackBarState, setIsOpenSnackBarState] = useState(false);

  useEffect(() => {
    const setSetting = async () => {
      const setting = await getTabCleanerSetting();
      setSettingState({
        isEnabled: setting.isEnabled,
        duration: setting.duration.toString(),
        durationUnit: setting.durationUnit,
      });
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSetting();
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

  const onChangeIsEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingState({ ...settingState, isEnabled: event.target.checked });
  };

  const onChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSettingState({ ...settingState, duration: value });
    setDurationErrorState(validateDurationValue(value));
  };

  const onChangeDurationUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingState({
      ...settingState,
      durationUnit: event.target.value as DurationUnit,
    });
  };

  const onSave = async () => {
    setSubmissionState({ isLoading: false, isError: false, errorMessage: "" });

    const durationErrorState = validateDurationValue(settingState.duration);
    if (durationErrorState.isError) {
      setDurationErrorState(durationErrorState);
      setSubmissionState({
        isLoading: false,
        isError: true,
        errorMessage: t.tabCleanerErrorOnSave,
      });
      return;
    }

    try {
      setSubmissionState({ isLoading: true, isError: false, errorMessage: "" });
      const setting = new TabCleaner(
        settingState.isEnabled,
        Number(settingState.duration),
        settingState.durationUnit,
      );
      await updateTabCleanerSetting(setting);
      setSubmissionState({
        isLoading: false,
        isError: false,
        errorMessage: "",
      });
      setIsOpenSnackBarState(true);
    } catch (e) {
      setSubmissionState({
        isLoading: false,
        isError: true,
        errorMessage: t.savedError,
      });
    }
  };

  return (
    <Box>
      <Card sx={{ p: 2 }}>
        <CardHeader
          sx={{ p: 0 }}
          title={
            <Typography variant="subtitle1" component="h3">
              {t.tabCleanerHeader}
            </Typography>
          }
        />
        <FormControl error={submissionState.isError} sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settingState.isEnabled}
                    onChange={onChangeIsEnabled}
                  />
                }
                label={
                  <Stack>
                    <Typography
                      variant="caption"
                      component="p"
                      style={{ color: "grey" }}
                    >
                      {t.tabCleanerDescription}
                    </Typography>
                  </Stack>
                }
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <TextField
                value={settingState.duration}
                variant="outlined"
                size="small"
                label={t.duration}
                disabled={!settingState.isEnabled}
                onChange={onChangeDuration}
                error={durationErrorState.isError}
                helperText={durationErrorState.errorMessage}
              />
              <FormControl
                size="small"
                sx={{ minWidth: 120 }}
                disabled={!settingState.isEnabled}
              >
                <InputLabel id="demo-simple-select-label">{t.unit}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={settingState.durationUnit}
                  label={t.unit}
                  onChange={onChangeDurationUnit}
                >
                  <MenuItem value={"day"}>{t.durationUnitDay}</MenuItem>
                  <MenuItem value={"hour"}>{t.durationUnitHour}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              disabled={submissionState.isLoading}
              sx={{ textTransform: "none" }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={onSave}
            >
              {submissionState.isLoading ? `${t.saving}...` : t.save}
            </Button>
            <FormHelperText style={{ marginTop: "4px" }}>
              {submissionState.errorMessage}
            </FormHelperText>
            <Snackbar
              open={isOpenSnackBarState}
              onClose={() => setIsOpenSnackBarState(false)}
              autoHideDuration={3000}
              message={t.savedSuccessfully}
            />
          </Stack>
        </FormControl>
      </Card>
    </Box>
  );
};

export default TabCleanerSettingForm;
