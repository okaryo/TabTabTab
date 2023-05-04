import { TabId } from './TabId'

export class Tab {
  constructor(
    private _id: TabId,
    private _title: string,
    private _url: URL,
    private _favIconUrl: string,
    private _isFocused: boolean,
    private _lastActivatedAt?: Date,
  ) {}

  get id(): TabId { return this._id }

  get title(): string { return this._title }

  get originUrl(): string { return this._url.origin }

  get favIconUrl(): string { return this._favIconUrl }

  get isFocused(): boolean { return this._isFocused }

  get milliSecondsSinceLastActivatedAt(): number | null {
    if (!this._lastActivatedAt) return null

    const currentTime = new Date()
    return currentTime.getTime() - this._lastActivatedAt.getTime()
  }

  updateLastActivatedAt(lastActivatedAt: Date): Tab {
    return new Tab(this._id, this._title, this._url, this._favIconUrl, this._isFocused, lastActivatedAt)
  }
}
