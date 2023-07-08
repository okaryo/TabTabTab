import { Tab } from "../Tab";

export type DurationUnit = "day" | "hour";

export class TabCleaner {
  constructor(
    public isEnabled: boolean,
    public duration: number,
    public durationUnit: DurationUnit,
  ) {}

  updateIsEnabled(isEnabled: boolean): TabCleaner {
    return new TabCleaner(isEnabled, this.duration, this.durationUnit);
  }

  updateDuration(duration: number): TabCleaner {
    return new TabCleaner(this.isEnabled, duration, this.durationUnit);
  }

  updateDurationUnit(durationUnit: DurationUnit): TabCleaner {
    return new TabCleaner(this.isEnabled, this.duration, durationUnit);
  }

  shouldCleanUp(tab: Tab, currentDateTime: Date): boolean {
    const lastActivatedAt = tab.lastActivatedAt;
    if (!lastActivatedAt) return;

    const cleanUpDate = new Date(lastActivatedAt.getTime());
    if (this.durationUnit === "day") {
      cleanUpDate.setDate(cleanUpDate.getDate() + this.duration);
    } else if (this.durationUnit === "hour") {
      cleanUpDate.setHours(cleanUpDate.getHours() + this.duration);
    }

    return cleanUpDate.getTime() < currentDateTime.getTime();
  }
}
