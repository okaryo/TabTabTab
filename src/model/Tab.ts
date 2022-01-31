import { TabId } from './TabId'

export class Tab {
  constructor(
    private _id: TabId,
    private _title: string,
    private _favIconUrl: string,
    private _isFocused: boolean
  ) {}

  get id(): TabId { return this._id }

  get title(): string { return this._title }

  get favIconUrl(): string { return this._favIconUrl }

  get isFocused(): boolean { return this._isFocused }
}
