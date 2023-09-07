/* eslint @typescript-eslint/no-unsafe-argument: 0, @typescript-eslint/no-explicit-any: 0 */
import {
  findPinned,
  findTab,
  findTabGroup,
  findTabsByTitleOrUrl,
  findWindow,
  findWindowChild,
  flatTabsInWindow,
  flatTabsInWindows,
  hasDuplicatedTabs,
  indexOfWindowChild,
  moveTabOrTabGroup,
  updateLastActivatedAtOfTab,
} from "../../src/model/Window";
import { mockPinned, mockTabGroup } from "../factory/TabContainerFactory";
import { mockTab } from "../factory/TabFactory";
import { mockWindow } from "../factory/WindowFactory";

describe("#flatTabsInWindows", () => {
  describe("when windows is empty", () => {
    it("should return empty array", () => {
      expect(flatTabsInWindows([])).toEqual([]);
    });
  });

  describe("when windows is not empty", () => {
    describe("when windows have only tabs", () => {
      it("should return tabs", () => {
        const tabs1 = [mockTab({ id: 1 }), mockTab({ id: 2 })];
        const tabs2 = [mockTab({ id: 3 }), mockTab({ id: 4 })];
        const windows = [
          mockWindow({ id: 1, children: tabs1 }),
          mockWindow({ id: 2, children: tabs2 }),
        ];

        expect(flatTabsInWindows(windows)).toEqual([...tabs1, ...tabs2]);
      });
    });

    describe("when windows have tab container", () => {
      it("should return tabs", () => {
        const tabs1 = [mockTab({ id: 1 }), mockTab({ id: 2 })];
        const tabs2 = [mockTab({ id: 3 }), mockTab({ id: 4 })];
        const tabs3 = [mockTab({ id: 5 }), mockTab({ id: 6 })];
        const pinned = mockPinned({ id: "pinned", children: tabs1 });
        const tabGroup = mockTabGroup({ id: 1, children: tabs2 });
        const windows = [
          mockWindow({ id: 1, children: [pinned] }),
          mockWindow({ id: 2, children: [tabGroup, ...tabs3] }),
        ];

        expect(flatTabsInWindows(windows)).toEqual([
          ...tabs1,
          ...tabs2,
          ...tabs3,
        ]);
      });
    });
  });
});

describe("#flatTabsInWindow", () => {
  describe("when window is empty", () => {
    it("should return empty array", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(flatTabsInWindow(window)).toEqual([]);
    });
  });

  describe("when window is not empty", () => {
    describe("when window have only tabs", () => {
      it("should return tabs", () => {
        const tabs = [mockTab({ id: 1 }), mockTab({ id: 2 })];
        const window = mockWindow({ id: 1, children: tabs });

        expect(flatTabsInWindow(window)).toEqual([...tabs]);
      });
    });

    describe("when windows have tab container", () => {
      it("should return tabs", () => {
        const tabs1 = [mockTab({ id: 1 }), mockTab({ id: 2 })];
        const tabs2 = [mockTab({ id: 3 }), mockTab({ id: 4 })];
        const tabs3 = [mockTab({ id: 5 }), mockTab({ id: 6 })];
        const pinned = mockPinned({ id: "pinned", children: tabs1 });
        const tabGroup = mockTabGroup({ id: 1, children: tabs2 });
        const window = mockWindow({
          id: 1,
          children: [pinned, tabGroup, ...tabs3],
        });

        expect(flatTabsInWindow(window)).toEqual([
          ...tabs1,
          ...tabs2,
          ...tabs3,
        ]);
      });
    });
  });
});

describe("#findWindow", () => {
  describe("when windows is empty", () => {
    it("should return undefined", () => {
      expect(findWindow([], 1)).toBeUndefined();
    });
  });

  describe("when windows is not empty", () => {
    describe("when window is found", () => {
      it("should return window", () => {
        const window = mockWindow({ id: 1 });
        const windows = [window];

        expect(findWindow(windows, 1)).toEqual(window);
      });
    });

    describe("when window is not found", () => {
      it("should return undefined", () => {
        const window = mockWindow({ id: 1 });
        const windows = [window];

        expect(findWindow(windows, 2)).toBeUndefined();
      });
    });
  });
});

describe("#findWindowChild", () => {
  describe("when window is empty", () => {
    it("should return undefined", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(findWindowChild(window, 1)).toBeUndefined();
    });
  });

  describe("when window is not empty", () => {
    describe("when tab is found", () => {
      it("should return tab", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(findWindowChild(window, 1)).toEqual(tab);
      });
    });

    describe("when tab is not found", () => {
      it("returns undefined", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(findWindowChild(window, 2)).toBeUndefined();
      });
    });
  });
});

describe("#indexOfWindowChild", () => {
  describe("when window is empty", () => {
    it("should return -1", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(indexOfWindowChild(window, 1)).toEqual(-1);
    });
  });

  describe("when window is not empty", () => {
    describe("when tab is found", () => {
      it("should return index", () => {
        const tab1 = mockTab({ id: 1 });
        const tab2 = mockTab({ id: 2 });
        const window = mockWindow({ id: 1, children: [tab1, tab2] });

        expect(indexOfWindowChild(window, 2)).toEqual(1);
      });
    });

    describe("when tab is not found", () => {
      it("should return -1", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(indexOfWindowChild(window, 2)).toEqual(-1);
      });
    });
  });
});

describe("#findTab", () => {
  describe("when windows is empty", () => {
    it("should return undefined", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(findTab(window, 1)).toBeUndefined();
    });
  });

  describe("when windows is not empty", () => {
    describe("when tab is found", () => {
      it("should return tab", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(findTab(window, 1)).toEqual(tab);
      });
    });

    describe("when tab is not found", () => {
      it("should return undefined", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(findTab(window, 2)).toBeUndefined();
      });
    });
  });
});

describe("#findPinned", () => {
  describe("when windows is empty", () => {
    it("should return undefined", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(findPinned(window)).toBeUndefined();
    });
  });

  describe("when windows is not empty", () => {
    describe("when pinned is found", () => {
      it("should return pinned", () => {
        const tab = mockTab({ id: 1 });
        const pinned = mockPinned({ id: "pinned", children: [tab] });
        const window = mockWindow({ id: 1, children: [pinned] });

        expect(findPinned(window)).toEqual(pinned);
      });
    });

    describe("when pinned is not found", () => {
      it("should return undefined", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(findPinned(window)).toBeUndefined();
      });
    });
  });
});

describe("#findTabGroup", () => {
  describe("when windows is empty", () => {
    it("should return undefined", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(findTabGroup(window, 1)).toBeUndefined();
    });
  });

  describe("when windows is not empty", () => {
    describe("when tab group is found", () => {
      it("should return tab group", () => {
        const tab = mockTab({ id: 1 });
        const tabGroup = mockTabGroup({ id: 1, children: [tab] });
        const window = mockWindow({ id: 1, children: [tabGroup] });

        expect(findTabGroup(window, 1)).toEqual(tabGroup);
      });
    });

    describe("when tab group is not found", () => {
      it("should return undefined", () => {
        const tab = mockTab({ id: 1 });
        const tabGroup = mockTabGroup({ id: 1, children: [tab] });
        const window = mockWindow({ id: 1, children: [tabGroup] });

        expect(findTabGroup(window, 2)).toBeUndefined();
      });
    });
  });
});

describe("#indexOfWindowChild", () => {
  describe("when window is empty", () => {
    it("should return -1", () => {
      const window = mockWindow({ id: 1, children: [] });
      expect(indexOfWindowChild(window, 1)).toEqual(-1);
    });
  });

  describe("when window is not empty", () => {
    describe("when tab is found", () => {
      it("should return index", () => {
        const tab1 = mockTab({ id: 1 });
        const tab2 = mockTab({ id: 2 });
        const window = mockWindow({ id: 1, children: [tab1, tab2] });

        expect(indexOfWindowChild(window, 2)).toEqual(1);
      });
    });

    describe("when tab is not found", () => {
      it("should return -1", () => {
        const tab = mockTab({ id: 1 });
        const window = mockWindow({ id: 1, children: [tab] });

        expect(indexOfWindowChild(window, 2)).toEqual(-1);
      });
    });

    describe("when container is included", () => {
      it("should return index", () => {
        const tab1 = mockTab({ id: 1 });
        const tab2 = mockTab({ id: 2 });
        const tab3 = mockTab({ id: 3 });
        const tab4 = mockTab({ id: 4 });
        const tab5 = mockTab({ id: 5 });
        const tab6 = mockTab({ id: 6 });
        const pinned = mockPinned({ id: "pinned", children: [tab2] });
        const tabGroup1 = mockTabGroup({ id: 10, children: [tab3, tab4] });
        const tabGroup2 = mockTabGroup({ id: 11, children: [tab5, tab6] });
        const window = mockWindow({
          id: 100,
          children: [tab1, pinned, tabGroup1, tabGroup2],
        });

        expect(indexOfWindowChild(window, 11)).toEqual(4);
      });
    });

    describe("when target container index is 0", () => {
      it("should return 0", () => {
        const tab1 = mockTab({ id: 1 });
        const tab2 = mockTab({ id: 2 });
        const tab3 = mockTab({ id: 3 });
        const tab4 = mockTab({ id: 4 });
        const tabGroup = mockTabGroup({ id: 10, children: [tab1, tab2] });
        const window = mockWindow({
          id: 100,
          children: [tabGroup, tab3, tab4],
        });

        expect(indexOfWindowChild(window, 10)).toEqual(0);
      });
    });
  });
});

describe("#updateLastActivatedAtOfTab", () => {
  it("should update lastActivatedAt of tab", () => {
    const tab1 = mockTab({ id: 1, lastActivatedAt: new Date(2023, 8, 20) });
    const tab2 = mockTab({ id: 2, lastActivatedAt: new Date(2023, 8, 21) });
    const window1 = mockWindow({ id: 1, children: [tab1] });
    const window2 = mockWindow({ id: 2, children: [tab2] });
    const windows = [window1, window2];
    const lastActivatedAt = new Date(2023, 8, 25);
    const expected = [
      window1,
      {
        ...window2,
        children: [
          {
            ...tab2,
            lastActivatedAt,
          },
        ],
      },
    ];

    expect(updateLastActivatedAtOfTab(windows, 2, lastActivatedAt)).toEqual(
      expected,
    );
  });
});

describe("#findTabsByTitleOrUrl", () => {
  it("should return tabs", () => {
    const tab1 = mockTab({
      id: 1,
      title: "title1",
      url: new URL("https://example.com/1"),
    });
    const tab2 = mockTab({
      id: 2,
      title: "title2",
      url: new URL("https://example.com/2/target"),
    });
    const window = mockWindow({ id: 1, children: [tab1, tab2] });

    expect(findTabsByTitleOrUrl([window], "target")).toEqual([tab2]);
  });
});

describe("#hasDuplicatedTabs", () => {
  describe("when there are duplicated tabs", () => {
    it("should return true", () => {
      const tab1 = mockTab({
        id: 1,
        title: "title1",
        url: new URL("https://example.com/1"),
      });
      const tab2 = mockTab({
        id: 2,
        title: "title1",
        url: new URL("https://example.com/1"),
      });
      const window = mockWindow({ id: 1, children: [tab1, tab2] });

      expect(hasDuplicatedTabs([window], tab1)).toBeTruthy();
    });
  });

  describe("when there are no duplicated tabs", () => {
    it("should return false", () => {
      const tab1 = mockTab({
        id: 1,
        title: "title1",
        url: new URL("https://example.com/1"),
      });
      const tab2 = mockTab({
        id: 2,
        title: "title2",
        url: new URL("https://example.com/2"),
      });
      const window = mockWindow({ id: 1, children: [tab1, tab2] });

      expect(hasDuplicatedTabs([window], tab1)).toBeFalsy();
    });
  });
});

describe("#moveTabOrTabGroup", () => {
  describe("when source item is Tab", () => {
    describe("when source item is under Window", () => {
      describe("when destination is under Window", () => {
        it("should move to specified index under Window", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const window = mockWindow({
            id: 100,
            children: [tab1, tab2, tab3, tab4, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, 100, 4);
          const expected = mockWindow({
            id: 100,
            children: [tab1, tab2, tab4, tab5, tab3],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under Pinned", () => {
        it("should move to specified index under Pinned", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1, tab2] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tab3, tab4, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, "pinned", 1);
          const expected = mockWindow({
            id: 100,
            children: [{ ...pinned, children: [tab1, tab3, tab2] }, tab4, tab5],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under TabGroup", () => {
        it("should move to specified index under TabGroup", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const tabGroup = mockTabGroup({ id: 10, children: [tab1, tab2] });
          const window = mockWindow({
            id: 100,
            children: [tab3, tab4, tabGroup, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, 10, 1);
          const expected = mockWindow({
            id: 100,
            children: [
              tab4,
              { ...tabGroup, children: [tab1, tab3, tab2] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });
    });

    describe("when source item is under Pinned", () => {
      describe("when destination is under Window", () => {
        it("should move to specified index from Pinned directyly under Window", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1, tab2] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tab3, tab4, tab5],
          });

          const actual = moveTabOrTabGroup(window, 2, 100, 2);
          const expected = mockWindow({
            id: 100,
            children: [{ ...pinned, children: [tab1] }, tab3, tab2, tab4, tab5],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under Pinned", () => {
        it("should reorder under the same Pinned", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1, tab2] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tab3, tab4, tab5],
          });

          const actual = moveTabOrTabGroup(window, 2, "pinned", 0);
          const expected = mockWindow({
            id: 100,
            children: [{ ...pinned, children: [tab2, tab1] }, tab3, tab4, tab5],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under TabGroup", () => {
        it("should move to specified index under TabGroup", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1, tab2] });
          const tabGroup = mockTabGroup({ id: 10, children: [tab3, tab4] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tabGroup, tab5],
          });

          const actual = moveTabOrTabGroup(window, 2, 10, 1);
          const expected = mockWindow({
            id: 100,
            children: [
              { ...pinned, children: [tab1] },
              { ...tabGroup, children: [tab3, tab2, tab4] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });
    });

    describe("when source item is under TabGroup", () => {
      describe("when destination is under Window", () => {
        it("should move to specified index from TabGroup directyly under Window", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const tabGroup = mockTabGroup({ id: 10, children: [tab3, tab4] });
          const window = mockWindow({
            id: 100,
            children: [tab1, tab2, tabGroup, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, 100, 1);
          const expected = mockWindow({
            id: 100,
            children: [
              tab1,
              tab3,
              tab2,
              { ...tabGroup, children: [tab4] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under Pinned", () => {
        it("should move to specified index under Pinned", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1] });
          const tabGroup = mockTabGroup({ id: 10, children: [tab3, tab4] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tab2, tabGroup, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, "pinned", 0);
          const expected = mockWindow({
            id: 100,
            children: [
              { ...pinned, children: [tab3, tab1] },
              tab2,
              { ...tabGroup, children: [tab4] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under the same TabGroup", () => {
        it("should reorder under the same TabGroup", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const pinned = mockPinned({ id: "pinned", children: [tab1] });
          const tabGroup = mockTabGroup({ id: 10, children: [tab3, tab4] });
          const window = mockWindow({
            id: 100,
            children: [pinned, tab2, tabGroup, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, 10, 1);
          const expected = mockWindow({
            id: 100,
            children: [
              pinned,
              tab2,
              { ...tabGroup, children: [tab4, tab3] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });

      describe("when destination is under the other TabGroup", () => {
        it("should move to specified index under the other TabGroup", () => {
          const tab1 = mockTab({ id: 1 });
          const tab2 = mockTab({ id: 2 });
          const tab3 = mockTab({ id: 3 });
          const tab4 = mockTab({ id: 4 });
          const tab5 = mockTab({ id: 5 });
          const tabGroup1 = mockTabGroup({ id: 10, children: [tab1, tab2] });
          const tabGroup2 = mockTabGroup({ id: 11, children: [tab3, tab4] });
          const window = mockWindow({
            id: 100,
            children: [tabGroup1, tabGroup2, tab5],
          });

          const actual = moveTabOrTabGroup(window, 3, 10, 1);
          const expected = mockWindow({
            id: 100,
            children: [
              { ...tabGroup1, children: [tab1, tab3, tab2] },
              { ...tabGroup2, children: [tab4] },
              tab5,
            ],
          });
          expect(actual).toEqual(expected);
        });
      });
    });
  });

  describe("when source item is Pinned", () => {
    it("should return original window", () => {
      const tab1 = mockTab({ id: 1 });
      const tab2 = mockTab({ id: 2 });
      const tab3 = mockTab({ id: 3 });
      const tab4 = mockTab({ id: 4 });
      const tab5 = mockTab({ id: 5 });
      const pinned = mockPinned({ id: "pinned", children: [tab1, tab2] });
      const window = mockWindow({
        id: 100,
        children: [pinned, tab3, tab4, tab5],
      });

      const actual = moveTabOrTabGroup(window, "pinned" as any, 100, 3);
      const expected = window;
      expect(actual).toEqual(expected);
    });
  });

  describe("when source item is TabGorup", () => {
    it("should return reordered window", () => {
      const tab1 = mockTab({ id: 1 });
      const tab2 = mockTab({ id: 2 });
      const tab3 = mockTab({ id: 3 });
      const tab4 = mockTab({ id: 4 });
      const tab5 = mockTab({ id: 5 });
      const tabGroup = mockTabGroup({ id: 10, children: [tab1, tab2] });
      const window = mockWindow({
        id: 100,
        children: [tab3, tabGroup, tab4, tab5],
      });

      const actual = moveTabOrTabGroup(window, 10, 100, 3);
      const expected = mockWindow({
        id: 100,
        children: [tab3, tab4, tab5, tabGroup],
      });
      expect(actual).toEqual(expected);
    });
  });
});
