import { GroupedTabs } from "../../src/model/GroupedTabs";
import { GroupId } from "../../src/model/GroupId";
import { GroupedColor } from "../../src/model/GroupedColor";
import { Tab } from "../../src/model/Tab";
import { TabId } from "../../src/model/TabId";
import { WindowId } from "../../src/model/WindowId";

describe("#id", () => {
  it("should return group id", () => {
    const actual = new GroupedTabs(
      new GroupId(1),
      "name",
      new GroupedColor("red"),
      [],
    ).id;
    const expected = new GroupId(1);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#name", () => {
  it("should return group name", () => {
    const actual = new GroupedTabs(
      new GroupId(1),
      "name",
      new GroupedColor("red"),
      [],
    ).name;
    const expected = "name";
    expect(actual).toBe(expected);
  });
});

describe("#colorCode", () => {
  it("should return group color code", () => {
    const actual = new GroupedTabs(
      new GroupId(1),
      "name",
      new GroupedColor("red"),
      [],
    ).colorCode;
    const expected = "#F28B82";
    expect(actual).toBe(expected);
  });
});

describe("#length", () => {
  describe("when tabs count is 0", () => {
    it("should return 0", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [],
      ).length;
      const expected = 0;
      expect(actual).toBe(expected);
    });
  });

  describe("when tabs count is 1", () => {
    it("should return 1", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      ).length;
      const expected = 1;
      expect(actual).toBe(expected);
    });
  });
});

describe("#isEmpty", () => {
  describe("when tabs count is 0", () => {
    it("should return true", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [],
      ).isEmpty;
      expect(actual).toBeTruthy;
    });
  });

  describe("when tabs count is 1", () => {
    it("should return false", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      ).isEmpty;
      expect(actual).toBeFalsy;
    });
  });
});

describe("#add", () => {
  it("should add tab", () => {
    const actual = new GroupedTabs(
      new GroupId(1),
      "name",
      new GroupedColor("red"),
      [],
    ).add({
      id: new TabId(1),
      windowId: new WindowId(1),
      title: "title",
      url: new URL("https://example.com/path"),
      favIconUrl: "https://favicon.com",
      isFocused: false,
      isAudioPlaying: false,
    });
    const expected = new GroupedTabs(
      new GroupId(1),
      "name",
      new GroupedColor("red"),
      [
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ],
    );
    expect(actual).toStrictEqual(expected);
  });
});

describe("#map", () => {
  describe("when generate array of tab name", () => {
    it("should generate array of string", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      ).map((tab) => tab.title);
      const expected = ["title"];
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#removeTabBy", () => {
  describe("when includes target tab", () => {
    it("should remove target tab", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      ).removeTabBy(new TabId(1));
      const expected = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [],
      );
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when not includes target tab", () => {
    it("should not remove", () => {
      const actual = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      ).removeTabBy(new TabId(2));
      const expected = new GroupedTabs(
        new GroupId(1),
        "name",
        new GroupedColor("red"),
        [
          {
            id: new TabId(1),
            windowId: new WindowId(1),
            title: "title",
            url: new URL("https://example.com/path"),
            favIconUrl: "https://favicon.com",
            isFocused: false,
            isAudioPlaying: false,
          },
        ],
      );
      expect(actual).toStrictEqual(expected);
    });
  });
});
