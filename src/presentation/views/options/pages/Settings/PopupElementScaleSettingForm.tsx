import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import {
  getPopupElementScaleSetting,
  updatePopupElementScaleSetting,
} from "../../../../../data/repository/SettingsRepository";
import t from "../../../../../i18n/Translations";

type SubmissionState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

const PopupFontAndIconScaleSettingForm = () => {
  const MIN_SCALE = 50;
  const MAX_SCALE = 150;

  const [settingState, setSettingState] = useState("100");
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    isError: false,
    errorMessage: "",
  });
  const [isOpenSnackBarState, setIsOpenSnackBarState] = useState(false);

  useEffect(() => {
    const setSetting = async () => {
      const scale = await getPopupElementScaleSetting();
      setSettingState(scale.toString());
    };
    setSetting();
  }, []);

  const onChangeScale = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSettingState(value);
  };

  const onSave = async () => {
    setSubmissionState({ isLoading: false, isError: false, errorMessage: "" });

    if (!Number.isInteger(Number(settingState))) {
      setSubmissionState({
        isLoading: false,
        isError: true,
        errorMessage: t.popupElementScaleValidationErrorValueFormat,
      });
      return;
    }
    if (MIN_SCALE > Number(settingState) || Number(settingState) > MAX_SCALE) {
      setSubmissionState({
        isLoading: false,
        isError: true,
        errorMessage: t.popupElementScaleValidationErrorValueRange,
      });
      return;
    }

    try {
      setSubmissionState({ isLoading: true, isError: false, errorMessage: "" });
      await updatePopupElementScaleSetting(Number(settingState));
      setSubmissionState({
        isLoading: false,
        isError: false,
        errorMessage: "",
      });
      setIsOpenSnackBarState(true);
    } catch (_) {
      setSubmissionState({
        isLoading: false,
        isError: true,
        errorMessage: t.savedError,
      });
    }
  };

  return (
    <Card sx={{ p: 2 }} elevation={0}>
      <CardHeader
        sx={{ p: 0 }}
        title={
          <Typography variant="subtitle1" component="h3">
            {t.popupElementScaleHeader}
          </Typography>
        }
        subheader={
          <Typography variant="caption" component="p" style={{ color: "grey" }}>
            {t.popupElementScaleDescription}
          </Typography>
        }
      />
      <FormControl
        error={submissionState.isError}
        sx={{ width: "100%", pt: 1 }}
      >
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" spacing={2}>
              <TextField
                value={settingState}
                size="small"
                label={t.scale}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={onChangeScale}
              />
            </Stack>
          </Box>
          <Button
            variant="contained"
            disabled={submissionState.isLoading}
            sx={{ textTransform: "none" }}
            disableElevation
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
  );
};

export default PopupFontAndIconScaleSettingForm;
