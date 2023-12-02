type ColorType =
  | "grey"
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "pink"
  | "purple"
  | "cyan"
  | "orange";

export class GroupColor {
  constructor(public value: ColorType) {
    if (!GroupColor.values.includes(value)) {
      throw new Error("invalid color");
    }
    this.value = value;
  }

  static get values(): ColorType[] {
    return [
      "grey",
      "blue",
      "red",
      "yellow",
      "green",
      "pink",
      "purple",
      "cyan",
      "orange",
    ];
  }

  get code(): string {
    switch (this.value) {
      case "grey":
        return "#BDC1C6";
      case "blue":
        return "#8AB4F8";
      case "red":
        return "#F28B82";
      case "yellow":
        return "#FDD663";
      case "green":
        return "#81C995";
      case "pink":
        return "#F98BCB";
      case "purple":
        return "#D7AEFB";
      case "cyan":
        return "#78D9EC";
      case "orange":
        return "#FBAD70";
    }
  }
}
