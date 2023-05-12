export type DurationUnit = 'day' | 'hour'

export class AutoTabCloseSetting {
  constructor(
    public isEnabled: boolean,
    public duration: number,
    public durationUnit: DurationUnit,
  ) {}

  updateIsEnabled(isEnabled: boolean): AutoTabCloseSetting {
    return new AutoTabCloseSetting(isEnabled, this.duration, this.durationUnit)
  }

  updateDuration(duration: number): AutoTabCloseSetting {
    return new AutoTabCloseSetting(this.isEnabled, duration, this.durationUnit)
  }

  updateDurationUnit(durationUnit: DurationUnit): AutoTabCloseSetting {
    return new AutoTabCloseSetting(this.isEnabled, this.duration, durationUnit)
  }
}

