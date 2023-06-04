import { GroupedColor } from "../../src/model/GroupedColor";

describe("code", () => {
  describe("color is grey", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("grey").code;
      const expected = "#BDC1C6";
      expect(actual).toBe(expected);
    });
  });

  describe("color is blue", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("blue").code;
      const expected = "#8AB4F8";
      expect(actual).toBe(expected);
    });
  });

  describe("color is red", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("red").code;
      const expected = "#F28B82";
      expect(actual).toBe(expected);
    });
  });

  describe("color is yellow", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("yellow").code;
      const expected = "#FDD663";
      expect(actual).toBe(expected);
    });
  });

  describe("color is green", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("green").code;
      const expected = "#81C995";
      expect(actual).toBe(expected);
    });
  });

  describe("color is pink", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("pink").code;
      const expected = "#F98BCB";
      expect(actual).toBe(expected);
    });
  });

  describe("color is purple", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("purple").code;
      const expected = "#D7AEFB";
      expect(actual).toBe(expected);
    });
  });

  describe("color is cyan", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("cyan").code;
      const expected = "#78D9EC";
      expect(actual).toBe(expected);
    });
  });

  describe("color is orange", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupedColor("orange").code;
      const expected = "#FBAD70";
      expect(actual).toBe(expected);
    });
  });
});
