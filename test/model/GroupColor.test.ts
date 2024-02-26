import { GroupColor } from "../../src/model/GroupColor";

describe("#code", () => {
  it.each([
    { color: "grey", expected: "#BDC1C6" },
    { color: "blue", expected: "#8AB4F8" },
    { color: "red", expected: "#F28B82" },
    { color: "yellow", expected: "#FDD663" },
    { color: "green", expected: "#81C995" },
    { color: "pink", expected: "#F98BCB" },
    { color: "purple", expected: "#D7AEFB" },
    { color: "cyan", expected: "#78D9EC" },
    { color: "orange", expected: "#FBAD70" },
    { color: "invalid", expected: "error", isError: true },
  ])(
    "case %#: when color is $color, it should return $expected",
    ({ color, expected, isError }) => {
      if (isError) {
        expect(() => new GroupColor(color as any)).toThrowError();
        return;
      }

      const actual = new GroupColor(color as any).code;
      expect(actual).toBe(expected);
    },
  );
});
