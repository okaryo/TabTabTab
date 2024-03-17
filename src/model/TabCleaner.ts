import type { Tab } from "./Tab";

export type DurationUnit = "day" | "hour";

export type TabCleaner = {
  enabled: boolean;
  duration: number;
  durationUnit: DurationUnit;
};

export const defaultTabCleaner: TabCleaner = {
  enabled: false,
  duration: 5,
  durationUnit: "day",
};

export const shouldCleanUp = (
  cleaner: TabCleaner,
  tab: Tab,
  currentDateTime: Date,
): boolean => {
  const lastActivatedAt = tab.lastActivatedAt;
  if (!lastActivatedAt) return;

  const cleanUpDate = new Date(lastActivatedAt.getTime());
  if (cleaner.durationUnit === "day") {
    cleanUpDate.setDate(cleanUpDate.getDate() + cleaner.duration);
  } else if (cleaner.durationUnit === "hour") {
    cleanUpDate.setHours(cleanUpDate.getHours() + cleaner.duration);
  }

  return cleanUpDate.getTime() < currentDateTime.getTime();
};
