import { GroupColor } from "../../src/model/GroupColor";
import { describe, expect, test } from "vitest";

describe("#code", () => {
  describe("when color is grey", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("grey").code;
      const expected = "#BDC1C6";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is blue", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("blue").code;
      const expected = "#8AB4F8";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is red", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("red").code;
      const expected = "#F28B82";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is yellow", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("yellow").code;
      const expected = "#FDD663";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is green", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("green").code;
      const expected = "#81C995";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is pink", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("pink").code;
      const expected = "#F98BCB";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is purple", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("purple").code;
      const expected = "#D7AEFB";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is cyan", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("cyan").code;
      const expected = "#78D9EC";
      expect(actual).toBe(expected);
    });
  });

  describe("when color is orange", () => {
    test("should return corresponding color code", () => {
      const actual = new GroupColor("orange").code;
      const expected = "#FBAD70";
      expect(actual).toBe(expected);
    });
  });
});
