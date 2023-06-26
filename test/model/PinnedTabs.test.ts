import { PinnedTabs } from "../../src/model/PinnedTabs";
import { Tab } from "../../src/model/Tab";
import { TabId } from "../../src/model/TabId";
import { WindowId } from "../../src/model/WindowId";

describe("#empty", () => {
  it("should generate empty PinnedTabs", () => {
    const actual = PinnedTabs.empty();
    const expected = new PinnedTabs([]);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#length", () => {
  describe("when value count is 0", () => {
    it("should return 0", () => {
      const actual = new PinnedTabs([]).length;
      const expected = 0;
      expect(actual).toBe(expected);
    });
  });

  describe("when value count is 2", () => {
    it("should return 2", () => {
      const actual = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]).length;
      const expected = 2;
      expect(actual).toBe(expected);
    });
  });
});

describe("#isEmpty", () => {
  describe("when values are emtpy", () => {
    it("should return true", () => {
      const actual = new PinnedTabs([]).isEmpty;
      expect(actual).toBeTruthy;
    });
  });

  describe("when values are not emtpy", () => {
    it("should return false", () => {
      const actual = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]).isEmpty;
      expect(actual).toBeFalsy;
    });
  });
});

describe("#add", () => {
  it("should add tab", () => {
    const actual = new PinnedTabs([
      {
        id: new TabId(1),
        windowId: new WindowId(1),
        title: "title1",
        url: new URL("https://example.com/path"),
        favIconUrl: "https://favicon.com",
        isFocused: false,
        isAudioPlaying: false,
      },
    ]).add({
      id: new TabId(2),
      windowId: new WindowId(1),
      title: "title2",
      url: new URL("https://example.com/path"),
      favIconUrl: "https://favicon.com",
      isFocused: false,
      isAudioPlaying: false,
    });
    const expected = new PinnedTabs([
      {
        id: new TabId(1),
        windowId: new WindowId(1),
        title: "title1",
        url: new URL("https://example.com/path"),
        favIconUrl: "https://favicon.com",
        isFocused: false,
        isAudioPlaying: false,
      },
      {
        id: new TabId(2),
        windowId: new WindowId(1),
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

describe("#map", () => {
  describe("when return title in map function", () => {
    it("should return array of title", () => {
      const actual = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]).map((tab) => tab.title);
      const expected = ["title1", "title2"];
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#removeTabBy", () => {
  describe("when contains target tab", () => {
    it("should remove target tab", () => {
      const actual = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]).removeTabBy(new TabId(1));
      const expected = new PinnedTabs([
        {
          id: new TabId(2),
          windowId: new WindowId(1),
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

  describe("when contains not target tab", () => {
    it("should not remove target tab", () => {
      const actual = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
          title: "title2",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
      ]).removeTabBy(new TabId(3));
      const expected = new PinnedTabs([
        {
          id: new TabId(1),
          windowId: new WindowId(1),
          title: "title1",
          url: new URL("https://example.com/path"),
          favIconUrl: "https://favicon.com",
          isFocused: false,
          isAudioPlaying: false,
        },
        {
          id: new TabId(2),
          windowId: new WindowId(1),
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
});
