import { GroupColor } from "../../src/model/GroupColor";

describe("code", () => {
  describe("color is grey", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("grey").code;
      const expected = "#BDC1C6";
      expect(actual).toBe(expected);
    });
  });

  describe("color is blue", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("blue").code;
      const expected = "#8AB4F8";
      expect(actual).toBe(expected);
    });
  });

  describe("color is red", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("red").code;
      const expected = "#F28B82";
      expect(actual).toBe(expected);
    });
  });

  describe("color is yellow", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("yellow").code;
      const expected = "#FDD663";
      expect(actual).toBe(expected);
    });
  });

  describe("color is green", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("green").code;
      const expected = "#81C995";
      expect(actual).toBe(expected);
    });
  });

  describe("color is pink", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("pink").code;
      const expected = "#F98BCB";
      expect(actual).toBe(expected);
    });
  });

  describe("color is purple", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("purple").code;
      const expected = "#D7AEFB";
      expect(actual).toBe(expected);
    });
  });

  describe("color is cyan", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("cyan").code;
      const expected = "#78D9EC";
      expect(actual).toBe(expected);
    });
  });

  describe("color is orange", () => {
    it("should return corresponding color code", () => {
      const actual = new GroupColor("orange").code;
      const expected = "#FBAD70";
      expect(actual).toBe(expected);
    });
  });
});
