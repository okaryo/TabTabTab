import { GroupedTabs } from './GroupedTabs'
import { PinnedTabs } from './PinnedTabs'
import { Tab } from './Tab'

type Tabable = Tab | PinnedTabs | GroupedTabs

export class Tabs {
  constructor(
    private _values: Tabable[],
  ) {}

  get values(): Tabable[] {
    return this._values
  }
}
