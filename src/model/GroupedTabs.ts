import { GroupedColor } from './GroupedColor'
import { GroupId } from './GroupId'
import { Tab } from './Tab'

export class GroupedTabs {
  constructor(
    private _id: GroupId,
    private _name: string,
    private _color: GroupedColor,
    private _values: Tab[],
  ) {}

  get id(): GroupId { return this._id }

  get name(): string { return this._name === '' ? 'No Name' : this._name }

  get colorCode(): string { return this._color.code }

  add(tab: Tab): GroupedTabs {
    return new GroupedTabs(this._id, this._name, this._color, [...this._values, tab])
  }

  map<T>(callback: (value: Tab) => T): T[] {
    return this._values.map<T>((value) => callback(value))
  }
}
