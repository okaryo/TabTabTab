export type DurationUnit = 'day' | 'hour'

export class TabCleaner {
  constructor(
    public isEnabled: boolean,
    public duration: number,
    public durationUnit: DurationUnit,
  ) {}

  updateIsEnabled(isEnabled: boolean): TabCleaner {
    return new TabCleaner(isEnabled, this.duration, this.durationUnit)
  }

  updateDuration(duration: number): TabCleaner {
    return new TabCleaner(this.isEnabled, duration, this.durationUnit)
  }

  updateDurationUnit(durationUnit: DurationUnit): TabCleaner {
    return new TabCleaner(this.isEnabled, this.duration, durationUnit)
  }
}
