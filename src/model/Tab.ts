import { TabId } from "./TabId";
import { Windows } from "./Windows";

export class Tab {
  constructor(
    private _id: TabId,
    private _title: string,
    private _url: URL,
    private _favIconUrl: string,
    private _isFocused: boolean,
    private _lastActivatedAt?: Date
  ) {}

  get id(): TabId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get url(): string {
    return this._url.href;
  }

  get originUrl(): string {
    return this._url.origin;
  }

  get favIconUrl(): string {
    return this._favIconUrl;
  }

  get isFocused(): boolean {
    return this._isFocused;
  }

  get lastActivatedAt(): Date | null {
    return this._lastActivatedAt || null;
  }

  get milliSecondsSinceLastActivatedAt(): number | null {
    if (!this._lastActivatedAt) return null;

    const currentTime = new Date();
    return currentTime.getTime() - this._lastActivatedAt.getTime();
  }

  updateLastActivatedAt(lastActivatedAt: Date): Tab {
    return new Tab(
      this._id,
      this._title,
      this._url,
      this._favIconUrl,
      this._isFocused,
      lastActivatedAt
    );
  }

  hasDuplicatedTabs(windows: Windows): boolean {
    return windows.values.some((window) => {
      return window.flatTabs.some(
        (tab) =>
          !this.id.equalTo(tab.id) &&
          this.title === tab.title &&
          this.url === tab.url
      );
    });
  }
}
