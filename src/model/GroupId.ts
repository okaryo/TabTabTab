export class GroupId {
  constructor(private _value: number) {}

  get value(): number { return this._value }

  equal(id: GroupId): boolean { return this._value === id.value }
}
