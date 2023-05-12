import { AutoTabCloseSetting, DurationUnit } from '../model/settings/AutoTabCloseSetting'

type StoredData = {
  auto_tab_close_setting: {
    isEnabled: boolean
    duration: number
    durationUnit: DurationUnit
  }
}

const AUTO_TAB_CLOSE_SETTING_KEY = 'auto_tab_close_setting'

export const getAutoTabCloseSetting = async (): Promise<AutoTabCloseSetting> => {
  const { auto_tab_close_setting } = await chrome.storage.session.get(AUTO_TAB_CLOSE_SETTING_KEY) as StoredData
  if (!auto_tab_close_setting) return new AutoTabCloseSetting(false, 5, 'day')

  return new AutoTabCloseSetting(
    auto_tab_close_setting.isEnabled,
    auto_tab_close_setting.duration,
    auto_tab_close_setting.durationUnit
  )
}

export const updateAutoTabCloseSetting = (setting: AutoTabCloseSetting): Promise<void> => {
  return chrome.storage.session.set(
    {
      [AUTO_TAB_CLOSE_SETTING_KEY]: {
        isEnabled: setting.isEnabled,
        duration: setting.duration,
        durationUnit: setting.durationUnit
      }
    }
  )
}
