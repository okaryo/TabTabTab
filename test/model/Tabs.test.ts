import { GroupedColor } from "../../src/model/GroupedColor";
import { GroupedTabs } from "../../src/model/GroupedTabs";
import { GroupId } from "../../src/model/GroupId";
import { PinnedTabs } from "../../src/model/PinnedTabs";
import { Tab } from "../../src/model/Tab";
import { TabId } from "../../src/model/TabId";
import { Tabs } from "../../src/model/Tabs";
import { WindowId } from "../../src/model/WindowId";

describe("#empty", () => {
  it("should generate empty Tabs", () => {
    const actual = Tabs.empty();
    const expected = new Tabs([]);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#values", () => {
  describe("when Tabs has tabs", () => {
    it("should return tabs array", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]).values;
      const expected = [
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ];
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when Tabs dose not have tabs", () => {
    it("should return empty array", () => {
      const actual = new Tabs([]).values;
      const expected = [];
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#pinnedTabs", () => {
  describe("when Tabs has PinnedTab", () => {
    it("should return PinnedTabs", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new PinnedTabs([
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title1",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]).pinnedTabs;
      const expected = new PinnedTabs([
        new Tab(
          new TabId(3),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when Tabs dose not have PinnedTabs", () => {
    it("should return empty PinnedTabs", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]).pinnedTabs;
      const expected = new PinnedTabs([]);
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#totalTabCount", () => {
  describe("when tabs contain 2 tabs and PinnedTabs that contain 1 tab", () => {
    it("should return 3", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new PinnedTabs([
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title1",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]).totalTabCount;
      const expected = 3;
      expect(actual).toBe(expected);
    });
  });
});

describe("#add", () => {
  it("should add tab", () => {
    const actual = new Tabs([
      new Tab(
        new TabId(1),
        new WindowId(1),
        "title1",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
    ]).add(
      new Tab(
        new TabId(2),
        new WindowId(1),
        "title2",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      )
    );
    const expected = new Tabs([
      new Tab(
        new TabId(1),
        new WindowId(1),
        "title1",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
      new Tab(
        new TabId(2),
        new WindowId(1),
        "title2",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
    ]);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#map", () => {
  it("should return title array", () => {
    const actual = new Tabs([
      new Tab(
        new TabId(1),
        new WindowId(1),
        "title1",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
      new Tab(
        new TabId(2),
        new WindowId(1),
        "title2",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
    ]).map((tab) => (tab as Tab).title);
    const expected = ["title1", "title2"];
    expect(actual).toStrictEqual(expected);
  });
});

describe("#addGroupedTabBy", () => {
  describe("when GroupedTab has not been yet contained", () => {
    it("should add new GroupedTab", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]).addGroupedTabBy(
        new GroupId(1),
        "groupName",
        new GroupedColor("red"),
        new Tab(
          new TabId(3),
          new WindowId(1),
          "title3",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        )
      );
      const expected = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new GroupedTabs(new GroupId(1), "groupName", new GroupedColor("red"), [
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when GroupedTab has been already contained", () => {
    it("should add tab to GroupedTab", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new GroupedTabs(new GroupId(1), "groupName", new GroupedColor("red"), [
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]).addGroupedTabBy(
        new GroupId(1),
        "groupName",
        new GroupedColor("red"),
        new Tab(
          new TabId(4),
          new WindowId(1),
          "title4",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        )
      );
      const expected = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new GroupedTabs(new GroupId(1), "groupName", new GroupedColor("red"), [
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
          new Tab(
            new TabId(4),
            new WindowId(1),
            "title4",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#addPinnedTab", () => {
  describe("when PinnedTab has not been yet contained", () => {
    it("should add new PinnedTab", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]).addPinnedTab(
        new Tab(
          new TabId(3),
          new WindowId(1),
          "title3",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        )
      );
      const expected = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new PinnedTabs([
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when PinnedTab has been already contained", () => {
    it("should add tab to PinnedTab", () => {
      const actual = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new PinnedTabs([
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]).addPinnedTab(
        new Tab(
          new TabId(4),
          new WindowId(1),
          "title4",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        )
      );
      const expected = new Tabs([
        new Tab(
          new TabId(1),
          new WindowId(1),
          "title1",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new Tab(
          new TabId(2),
          new WindowId(1),
          "title2",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
        new PinnedTabs([
          new Tab(
            new TabId(3),
            new WindowId(1),
            "title3",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
          new Tab(
            new TabId(4),
            new WindowId(1),
            "title4",
            new URL("https://example.com/path"),
            "https://favicon.com",
            false
          ),
        ]),
      ]);
      expect(actual).toStrictEqual(expected);
    });
  });
});

describe("#removeTabBy", () => {
  it("should remove target tab", () => {
    const actual = new Tabs([
      new Tab(
        new TabId(1),
        new WindowId(1),
        "title1",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
      new Tab(
        new TabId(2),
        new WindowId(1),
        "title2",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
      new PinnedTabs([
        new Tab(
          new TabId(3),
          new WindowId(1),
          "title3",
          new URL("https://example.com/path"),
          "https://favicon.com",
          false
        ),
      ]),
    ]).removeTabBy(new TabId(3));
    const expected = new Tabs([
      new Tab(
        new TabId(1),
        new WindowId(1),
        "title1",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
      new Tab(
        new TabId(2),
        new WindowId(1),
        "title2",
        new URL("https://example.com/path"),
        "https://favicon.com",
        false
      ),
    ]);
    expect(actual).toStrictEqual(expected);
  });
});
