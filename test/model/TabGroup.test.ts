import { TabGroup } from "../../src/model/TabGroup";
import { GroupColor } from "../../src/model/GroupColor";

describe("#id", () => {
  it("should return group id", () => {
    const actual = new TabGroup(1, "name", new GroupColor("red"), false, []).id;
    const expected = 1;
    expect(actual).toStrictEqual(expected);
  });
});

describe("#name", () => {
  it("should return group name", () => {
    const actual = new TabGroup(1, "name", new GroupColor("red"), false, [])
      .name;
    const expected = "name";
    expect(actual).toBe(expected);
  });
});

describe("#colorCode", () => {
  it("should return group color code", () => {
    const actual = new TabGroup(1, "name", new GroupColor("red"), false, [])
      .colorCode;
    const expected = "#F28B82";
    expect(actual).toBe(expected);
  });
});

describe("#length", () => {
  describe("when tabs count is 0", () => {
    it("should return 0", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [])
        .length;
      const expected = 0;
      expect(actual).toBe(expected);
    });
  });

  describe("when tabs count is 1", () => {
    it("should return 1", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]).length;
      const expected = 1;
      expect(actual).toBe(expected);
    });
  });
});

describe("#isEmpty", () => {
  describe("when tabs count is 0", () => {
    it("should return true", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [])
        .isEmpty;
      expect(actual).toBeTruthy;
    });
  });

  describe("when tabs count is 1", () => {
    it("should return false", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]).isEmpty;
      expect(actual).toBeFalsy;
    });
  });
});

describe("#add", () => {
  it("should add tab", () => {
    const actual = new TabGroup(
      1,
      "name",
      new GroupColor("red"),
      false,
      [],
    ).add({
      id: 1,
      windowId: 1,
      title: "title",
      url: new URL("https://example.com/path"),
      favIconUrl: new URL("https://favicon.com"),
      highlighted: false,
      audible: false,
    });
    const expected = new TabGroup(1, "name", new GroupColor("red"), false, [
      {
        id: 1,
        windowId: 1,
        title: "title",
        url: new URL("https://example.com/path"),
        favIconUrl: new URL("https://favicon.com"),
        highlighted: false,
        audible: false,
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#map", () => {
  describe("when generate array of tab name", () => {
    it("should generate array of string", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]).map((tab) => tab.title);
      const expected = ["title"];
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#removeTabBy", () => {
  describe("when includes target tab", () => {
    it("should remove target tab", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]).removeTabBy(1);
      const expected = new TabGroup(
        1,
        "name",
        new GroupColor("red"),
        false,
        [],
      );
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when not includes target tab", () => {
    it("should not remove", () => {
      const actual = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]).removeTabBy(2);
      const expected = new TabGroup(1, "name", new GroupColor("red"), false, [
        {
          id: 1,
          windowId: 1,
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: new URL("https://favicon.com"),
          highlighted: false,
          audible: false,
        },
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });
});
