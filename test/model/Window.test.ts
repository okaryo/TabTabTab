import { GroupedColor } from "../../src/model/GroupedColor";
import { GroupedTabs } from "../../src/model/GroupedTabs";
import { Tabs } from "../../src/model/Tabs";
import { Window } from "../../src/model/Window";
import buildTab from "../factory/TabFactory";

describe("#initializeBy", () => {
  it("should generate empty window", () => {
    const actual = Window.initializeBy(1, false);
    const expected = new Window(1, new Tabs([]), false);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#id", () => {
  it("should return it", () => {
    const actual = new Window(1, new Tabs([]), false).id;
    const expected = 1;
    expect(actual).toStrictEqual(expected);
  });
});

describe("#tabs", () => {
  it("should return tabs", () => {
    const actual = new Window(
      1,
      new Tabs([
        {
          id: 1,
          windowId: 1,
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: 2,
          windowId: 1,
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]),
      false,
    ).tabs;
    const expected = new Tabs([
      {
        id: 1,
        windowId: 1,
        title: "title1",
        url: new URL("https://example.com/path"),
        favIconUrl: "https://favicon.com",
        isFocused: false,
        isAudioPlaying: false,
      },
      {
        id: 2,
        windowId: 1,
        title: "title2",
        url: new URL("https://example.com/path"),
        favIconUrl: "https://favicon.com",
        isFocused: false,
        isAudioPlaying: false,
      },
    ]);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#isFocused", () => {
  describe("when window is focused", () => {
    it("should return true", () => {
      const actual = new Window(1, new Tabs([]), true).isFocused;
      expect(actual).toBeTruthy;
    });
  });

  describe("when window is not focused", () => {
    it("should return false", () => {
      const actual = new Window(1, new Tabs([]), false).isFocused;
      expect(actual).toBeFalsy;
    });
  });
});

describe("#tabCount", () => {
  it("should return tab count", () => {
    const actual = new Window(
      1,
      new Tabs([
        {
          id: 1,
          windowId: 1,
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: 2,
          windowId: 1,
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]),
      false,
    ).tabCount;
    const expected = 2;
    expect(actual).toBe(expected);
  });
});

describe("#addTab", () => {});

describe("#addPinnedTab", () => {});

describe("#removeTabBy", () => {
  describe("when target tab is in grouped tab", () => {
    it("should remove tab", () => {
      const actual = new Window(
        1,
        new Tabs([
          new GroupedTabs(
            1,
            "name",
            new GroupedColor("red"),
            false,
            [buildTab(1), buildTab(2)],
          ),
          buildTab(3),
          buildTab(4),
        ]),
        false,
      ).removeTabBy(1);
      const expected = new Window(
        1,
        new Tabs([
          new GroupedTabs(
            1,
            "name",
            new GroupedColor("red"),
            false,
            [buildTab(2)],
          ),
          buildTab(3),
          buildTab(4),
        ]),
        false,
      );
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when target tab is normal tab", () => {
    it("should remove tab", () => {
      const actual = new Window(
        1,
        new Tabs([
          new GroupedTabs(
            1,
            "name",
            new GroupedColor("red"),
            false,
            [buildTab(1), buildTab(2)],
          ),
          buildTab(3),
          buildTab(4),
        ]),
        false,
      ).removeTabBy(3);
      const expected = new Window(
        1,
        new Tabs([
          new GroupedTabs(
            1,
            "name",
            new GroupedColor("red"),
            false,
            [buildTab(1), buildTab(2)],
          ),
          buildTab(4),
        ]),
        false,
      );
      expect(actual).toStrictEqual(expected);
    });
  });
});
