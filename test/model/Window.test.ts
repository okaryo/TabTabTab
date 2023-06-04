import { GroupedColor } from "../../src/model/GroupedColor";
import { GroupedTabs } from "../../src/model/GroupedTabs";
import { GroupId } from "../../src/model/GroupId";
import { Tab } from "../../src/model/Tab";
import { TabId } from "../../src/model/TabId";
import { Tabs } from "../../src/model/Tabs";
import { Window } from "../../src/model/Window";
import { WindowId } from "../../src/model/WindowId";
import buildTab from "../factory/TabFactory";

describe("#initializeBy", () => {
  it("should generate empty window", () => {
    const actual = Window.initializeBy(new WindowId(1), false);
    const expected = new Window(new WindowId(1), new Tabs([]), false);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#id", () => {
  it("should return it", () => {
    const actual = new Window(new WindowId(1), new Tabs([]), false).id;
    const expected = new WindowId(1);
    expect(actual).toStrictEqual(expected);
  });
});

describe("#tabs", () => {
  it("should return tabs", () => {
    const actual = new Window(
      new WindowId(1),
      new Tabs([
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
      ]),
      false
    ).tabs;
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

describe("#isFocused", () => {
  describe("when window is focused", () => {
    it("should return true", () => {
      const actual = new Window(new WindowId(1), new Tabs([]), true).isFocused;
      expect(actual).toBeTruthy;
    });
  });

  describe("when window is not focused", () => {
    it("should return false", () => {
      const actual = new Window(new WindowId(1), new Tabs([]), false).isFocused;
      expect(actual).toBeFalsy;
    });
  });
});

describe("#tabCount", () => {
  it("should return tab count", () => {
    const actual = new Window(
      new WindowId(1),
      new Tabs([
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
      ]),
      false
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
        new WindowId(1),
        new Tabs([
          new GroupedTabs(new GroupId(1), "name", new GroupedColor("red"), [
            buildTab(1),
            buildTab(2),
          ]),
          buildTab(3),
          buildTab(4),
        ]),
        false
      ).removeTabBy(new TabId(1));
      const expected = new Window(
        new WindowId(1),
        new Tabs([
          new GroupedTabs(new GroupId(1), "name", new GroupedColor("red"), [
            buildTab(2),
          ]),
          buildTab(3),
          buildTab(4),
        ]),
        false
      );
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("when target tab is normal tab", () => {
    it("should remove tab", () => {
      const actual = new Window(
        new WindowId(1),
        new Tabs([
          new GroupedTabs(new GroupId(1), "name", new GroupedColor("red"), [
            buildTab(1),
            buildTab(2),
          ]),
          buildTab(3),
          buildTab(4),
        ]),
        false
      ).removeTabBy(new TabId(3));
      const expected = new Window(
        new WindowId(1),
        new Tabs([
          new GroupedTabs(new GroupId(1), "name", new GroupedColor("red"), [
            buildTab(1),
            buildTab(2),
          ]),
          buildTab(4),
        ]),
        false
      );
      expect(actual).toStrictEqual(expected);
    });
  });
});
