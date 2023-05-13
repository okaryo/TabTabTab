import { TabCleaner, DurationUnit } from '../model/settings/TabCleaner'

type StoredData = {
  tab_cleaner_setting: {
    isEnabled: boolean
    duration: number
    durationUnit: DurationUnit
  }
}

const TAB_CLEANER_SETTING_KEY = 'tab_cleaner_setting'

export const getTabCleanerSetting = async (): Promise<TabCleaner> => {
  const { tab_cleaner_setting } = await chrome.storage.local.get(TAB_CLEANER_SETTING_KEY) as StoredData
  if (!tab_cleaner_setting) return new TabCleaner(false, 5, 'day')

  return new TabCleaner(
    tab_cleaner_setting.isEnabled,
    tab_cleaner_setting.duration,
    tab_cleaner_setting.durationUnit
  )
}

export const updateTabCleanerSetting = (TabCleaner: TabCleaner): Promise<void> => {
  return chrome.storage.local.set(
    {
      [TAB_CLEANER_SETTING_KEY]: {
        isEnabled: TabCleaner.isEnabled,
        duration: TabCleaner.duration,
        durationUnit: TabCleaner.durationUnit
      }
    }
  )
}
