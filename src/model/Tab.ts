import { TabId } from './TabId'

export class Tab {
  constructor(
    private _id: TabId,
    private _title: string,
    private _favIconUrl: string,
    private _isFocused: boolean
  ) {}

  get id(): number { return this._id.value }

  get title(): string { return this._title }

  get favIconUrl(): string { return this._favIconUrl }
}
