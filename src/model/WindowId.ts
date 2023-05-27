export class WindowId {
  constructor(private _value: number) {}

  get value(): number {
    return this._value;
  }

  equalTo(id: WindowId): boolean {
    return this._value === id.value;
  }
}
