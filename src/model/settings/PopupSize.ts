export class PopupSize {
  constructor(public height: number, public width: number) {}

  updateHeight(value: number): PopupSize {
    return new PopupSize(value, this.width);
  }

  updateWidth(value: number): PopupSize {
    return new PopupSize(this.height, value);
  }
}
