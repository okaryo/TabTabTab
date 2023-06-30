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
import React, { useEffect, useState } from "react";

import t from "../../../i18n/Translations";
import { PopupSize } from "../../../model/settings/PopupSize";
import {
  getPopupSizeSetting,
  updatePopupSizeSetting,
} from "../../../repository/SettingsRepository";

type SettingForm = {
  height: string;
  width: string;
};
type SubmittionState = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

const PopupSizeSettingForm = () => {
  const MIN_HEIGHT = 200;
  const MAX_HEIGHT = 600;
  const MIN_WIDTH = 400;
  const MAX_WIDTH = 800;

  const [settingState, setSettingState] = useState<SettingForm>({
    height: "500",
    width: "500",
  });
  const [submittionState, setSubmittionState] = useState<SubmittionState>({
    isLoading: false,
    isError: false,
    errorMessage: "",
  });
  const [isOpenSnackBarState, setIsOpenSnackBarState] = useState(false);

  useEffect(() => {
    const setSetting = async () => {
      const setting = await getPopupSizeSetting();
      setSettingState({
        height: setting.height.toString(),
        width: setting.width.toString(),
      });
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSetting();
  }, []);

  const onChangeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSettingState({ ...settingState, height: value });
  };
  const onChangeWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSettingState({ ...settingState, width: value });
  };

  const onSave = async () => {
    setSubmittionState({ isLoading: false, isError: false, errorMessage: "" });

    const { height, width } = settingState;
    if (!Number.isInteger(Number(height)) || !Number.isInteger(Number(width))) {
      setSubmittionState({
        isLoading: false,
        isError: true,
        errorMessage: t.popupSizeValidationErrorValueFormat,
      });
      return;
    }
    if (
      MIN_HEIGHT > Number(height) ||
      Number(height) > MAX_HEIGHT ||
      MIN_WIDTH > Number(width) ||
      Number(width) > MAX_WIDTH
    ) {
      setSubmittionState({
        isLoading: false,
        isError: true,
        errorMessage: t.popupSizeValidationErrorValueRange,
      });
      return;
    }

    try {
      setSubmittionState({ isLoading: true, isError: false, errorMessage: "" });
      const setting = new PopupSize(Number(height), Number(width));
      await updatePopupSizeSetting(setting);
      setSubmittionState({
        isLoading: false,
        isError: false,
        errorMessage: "",
      });
      setIsOpenSnackBarState(true);
    } catch (e) {
      setSubmittionState({
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
              {t.popupSizeHeader}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              component="p"
              style={{ color: "grey" }}
            >
              {t.popupSizeDescription}
            </Typography>
          }
        />
        <FormControl
          error={submittionState.isError}
          sx={{ width: "100%", pt: 1 }}
        >
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" spacing={2}>
                <TextField
                  value={settingState.height}
                  variant="outlined"
                  size="small"
                  label={t.height}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">px</InputAdornment>
                    ),
                  }}
                  onChange={onChangeHeight}
                />
                <TextField
                  value={settingState.width}
                  variant="outlined"
                  size="small"
                  label={t.width}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">px</InputAdornment>
                    ),
                  }}
                  onChange={onChangeWidth}
                />
              </Stack>
            </Box>
            <Button
              variant="contained"
              disabled={submittionState.isLoading}
              sx={{ textTransform: "none" }}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={onSave}
            >
              {submittionState.isLoading ? `${t.saving}...` : t.save}
            </Button>
            <FormHelperText style={{ marginTop: "4px" }}>
              {submittionState.errorMessage}
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

export default PopupSizeSettingForm;
