import { Tab } from './Tab'

export class PinnedTabs {
  constructor(
    private _values: Tab[],
  ) {}

  static empty(): PinnedTabs { return new PinnedTabs([]) }

  add(tab: Tab): PinnedTabs {
    return new PinnedTabs([...this._values, tab])
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }
}
