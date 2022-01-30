import { TabId } from './TabId'

export class Tab {
  constructor(
    private _id: TabId,
    private _title: string,
    private _favIconUrl: string,
    private _isFocused: boolean
  ) {}

  get title(): string { return this._title }
}
