export class TabId {
  constructor(private _value: number) {}

  get value(): number { return this._value }

  equalTo(id: TabId): boolean { return this._value === id.value }
}
