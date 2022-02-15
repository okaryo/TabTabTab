type ColorType = 'grey' | 'blue' | 'red' | 'yellow' | 'green' | 'pink' | 'purple' | 'cyan' | 'orange'

export class GroupedColor {
  constructor(
    private _color: ColorType,
  ) {}

  get code(): string {
    switch (this._color) {
      case 'grey':
        return '#BDC1C6'
      case 'blue':
        return '#8AB4F8'
      case 'red':
        return '#F28B82'
      case 'yellow':
        return '#FDD663'
      case 'green':
        return '#81C995'
      case 'pink':
        return '#F98BCB'
      case 'purple':
        return '#D7AEFB'
      case 'cyan':
        return '#78D9EC'
      case 'orange':
        return '#FBAD70'
    }
  }
}
