export class Duration {
  static readonly MILLISECONDS_PER_SECOND = 1000;
  static readonly SECONDS_PER_MINUTE = 60;
  static readonly MINUTES_PER_HOUR = 60;
  static readonly HOURS_PER_DAY = 24;
  static readonly MILLISECONDS_PER_MINUTE =
    this.MILLISECONDS_PER_SECOND * this.SECONDS_PER_MINUTE;
  static readonly MILLISECONDS_PER_HOUR =
    this.MILLISECONDS_PER_MINUTE * this.MINUTES_PER_HOUR;
  static readonly MILLISECONDS_PER_DAY =
    this.MILLISECONDS_PER_HOUR * this.HOURS_PER_DAY;

  private _milliseconds: number;

  constructor({
    milliseconds = 0,
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
  }: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
  }) {
    this._milliseconds =
      milliseconds +
      seconds * Duration.MILLISECONDS_PER_SECOND +
      minutes * Duration.MILLISECONDS_PER_MINUTE +
      hours * Duration.MILLISECONDS_PER_HOUR +
      days * Duration.MILLISECONDS_PER_DAY;
  }

  static zero(): Duration {
    return new Duration({});
  }

  get inDays(): number {
    return Math.floor(this._milliseconds / Duration.MILLISECONDS_PER_DAY);
  }

  get inHours(): number {
    return Math.floor(this._milliseconds / Duration.MILLISECONDS_PER_HOUR);
  }

  get inMinutes(): number {
    return Math.floor(this._milliseconds / Duration.MILLISECONDS_PER_MINUTE);
  }

  get inSeconds(): number {
    return Math.floor(this._milliseconds / Duration.MILLISECONDS_PER_SECOND);
  }

  get inMilliseconds(): number {
    return this._milliseconds;
  }
}
