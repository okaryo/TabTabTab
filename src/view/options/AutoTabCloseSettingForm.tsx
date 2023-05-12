import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAutoTabCloseSetting, updateAutoTabCloseSetting } from '../../repository/SettingsRepository'
import { AutoTabCloseSetting, DurationUnit } from '../../model/settings/AutoTabCloseSetting'

type SettingForm = {
  isEnabled: boolean,
  duration: string,
  durationUnit: DurationUnit,
}
type SubmittionState = {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
}
type DurationErrorState = Omit<SubmittionState, 'isLoading'>;


const AutoTabCloseSettingForm = () => {
  const [settingState, setSettingState] = useState<SettingForm>({isEnabled: false, duration: '5', durationUnit: 'day'})
  const [durationErrorState, setDurationErrorState] = useState<DurationErrorState>({isError: false, errorMessage: ''})
  const [submittionState, setSubmittionState] = useState<SubmittionState>({isLoading: false, isError: false, errorMessage: ''})
  const [isOpenSnackBarState, setIsOpenSnackBarState] = useState(false)

  useEffect(() => {
    const setSetting = async () => {
      const setting = await getAutoTabCloseSetting()
      console.log(setting)
      setSettingState({
        isEnabled: setting.isEnabled,
        duration: setting.duration.toString(),
        durationUnit: setting.durationUnit,
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setSetting()
  }, [])

  const validateDurationValue = (value: string): DurationErrorState => {
    if (!Number.isInteger(Number(value))) {
      return {isError: true, errorMessage: 'Input an integer.'}
    }
    if (Number(value) <= 0) {
      return {isError: true, errorMessage: 'Input a positive integer.'}
    }

    return {isError: false, errorMessage: ''}
  }

  const onChangeIsEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingState({...settingState, isEnabled: event.target.checked})
  }

  const onChangeDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSettingState({...settingState, duration: value})
    setDurationErrorState(validateDurationValue(value))
  }

  const onChangeDurationUnit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingState({...settingState, durationUnit: event.target.value as DurationUnit})
  }

  const onSave = async () => {
    setSubmittionState({isLoading: false, isError: false, errorMessage: ''})

    const durationErrorState = validateDurationValue(settingState.duration)
    if (durationErrorState.isError) {
      setDurationErrorState(durationErrorState)
      setSubmittionState({isLoading: false, isError: true, errorMessage: 'Please fix the error.'})
      return
    }

    try {
      setSubmittionState({isLoading: true, isError: false, errorMessage: ''})
      const setting = new AutoTabCloseSetting(
        settingState.isEnabled,
        Number(settingState.duration),
        settingState.durationUnit
      )
      await updateAutoTabCloseSetting(setting)
      setSubmittionState({isLoading: false, isError: false, errorMessage: ''})
      setIsOpenSnackBarState(true)
    } catch (e) {
      setSubmittionState({isLoading: false, isError: true, errorMessage: 'Failed to save the setting. Please try again.'})
    }
  }

  return (
    <Box>
      <Card sx={{ p: 2 }}>
        <FormControl error={submittionState.isError}>
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
                    <Typography variant="subtitle1" component="h3">Close unused tabs automatically</Typography>
                    <Typography variant="caption" component="p" style={{color: 'grey'}}>By enabling this setting, tabs will automatically close once the set duration has passed since they were last active.</Typography>
                  </Stack>
                }
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <TextField
                value={settingState.duration}
                variant="outlined"
                size="small"
                label="Duration"
                disabled={!settingState.isEnabled}
                onChange={onChangeDuration}
                error={durationErrorState.isError}
                helperText={durationErrorState.errorMessage}
              />
              <FormControl size='small' sx={{ minWidth: 120 }} disabled={!settingState.isEnabled}>
                <InputLabel id="demo-simple-select-label">Unit</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  value={settingState.durationUnit}
                  label={'Unit'}
                  onChange={onChangeDurationUnit}
                >
                  <MenuItem value={'day'}>Day</MenuItem>
                  <MenuItem value={'hour'}>Hour</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              disabled={submittionState.isLoading}
              sx={{textTransform: 'none'}}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={onSave}
            >
              {submittionState.isLoading ? 'Saving...' : 'Save'}
            </Button>
            <FormHelperText style={{marginTop: '4px' }}>{submittionState.errorMessage}</FormHelperText>
            <Snackbar
              open={isOpenSnackBarState}
              onClose={() => setIsOpenSnackBarState(false)}
              autoHideDuration={3000}
              message="Setting successfully saved."
            />
          </Stack>
        </FormControl>
      </Card>
    </Box>
  )
}

export default AutoTabCloseSettingForm
