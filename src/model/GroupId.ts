export class GroupId {
  constructor(private _value: number) {}

  get value(): number { return this._value }

  equalTo(id: GroupId): boolean { return this._value === id.value }
}
