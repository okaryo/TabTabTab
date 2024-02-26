import { shouldCleanUp } from "../model/TabCleaner";
import { flatTabsInWindows } from "../model/Window";
import { getTabCleanerSetting } from "../repository/TabCleanerRepository";
import { removeTab } from "../repository/TabsRepository";
import { getWindows } from "../repository/WindowsRepository";

export const activateTabCleanerScheduler = async () => {
  const tabCleanerAlarmName = "tabCleanerAlarm";
  await chrome.alarms.create(tabCleanerAlarmName, {
    when: 0,
    periodInMinutes: 1,
  });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== tabCleanerAlarmName) return;

    const windows = await getWindows();
    const tabCleanerSetting = await getTabCleanerSetting();
    if (!tabCleanerSetting.enabled) return;

    for (const tab of flatTabsInWindows(windows)) {
      const currentDateTime = new Date();
      if (shouldCleanUp(tabCleanerSetting, tab, currentDateTime)) {
        await removeTab(tab.id);
      }
    }
  });
};
