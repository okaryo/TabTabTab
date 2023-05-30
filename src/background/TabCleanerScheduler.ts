import { getTabCleanerSetting } from "../repository/SettingsRepository";
import { removeTab } from "../repository/TabsRepository";
import { getWindows } from "../repository/WindowsRepository";

export const activateTabCleanerScheduler = async () => {
  const tabCleanerAlarmName = "tabCleanerAlarm";
  await chrome.alarms.create(tabCleanerAlarmName, {
    when: 0,
    periodInMinutes: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== tabCleanerAlarmName) return;

    const windows = await getWindows();
    const tabCleanerSetting = await getTabCleanerSetting();
    if (!tabCleanerSetting.isEnabled) return;

    for (const tab of windows.allTabs) {
      if (tabCleanerSetting.shouldCleanUp(tab, new Date())) {
        await removeTab(tab.id);
      }
    }
  });
};
