import { Duration } from "../../src/model/Duration";
import { type Tab, durationSinceLastActivatedAt } from "../../src/model/Tab";
import { mockTab } from "../factory/TabFactory";

describe("#durationSinceLastActivatedAt", () => {
  describe("when lastActivatedAt is present", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it.each([
      {
        currentTime: new Date(2023, 8, 25),
        lastActivatedAt: new Date(2023, 8, 20),
        expected: new Duration({ milliseconds: 5 * 24 * 60 * 60 * 1000 }),
      },
      {
        currentTime: new Date(2023, 8, 25),
        lastActivatedAt: new Date(2023, 8, 24),
        expected: new Duration({ milliseconds: 1 * 24 * 60 * 60 * 1000 }),
      },
      {
        currentTime: new Date(2023, 8, 25),
        lastActivatedAt: new Date(2023, 8, 25),
        expected: new Duration({ milliseconds: 0 }),
      },
      {
        currentTime: new Date(2023, 8, 25, 12, 30, 30),
        lastActivatedAt: new Date(2023, 8, 20, 12, 30, 10),
        expected: new Duration({
          milliseconds: 5 * 24 * 60 * 60 * 1000 + 20 * 1000,
        }),
      },
    ])(
      "case %#: when currentTime is $currentTime and lastActivatedAt is $lastActivatedAt, it should return $expected",
      ({ currentTime, lastActivatedAt, expected }) => {
        vi.setSystemTime(currentTime);

        const tab: Tab = {
          id: 1,
          title: "title",
          url: new URL("https://example.com"),
          active: false,
          audible: false,
          pinned: false,
          discarded: false,
          lastActivatedAt: lastActivatedAt,
        };
        const actual = durationSinceLastActivatedAt(tab);

        expect(actual).toEqual(expected);
      },
    );
  });

  describe("when lastActivatedAt is invalid", () => {
    it("returns zero when lastActivatedAt is undefined", () => {
      const tab: Tab = mockTab({ lastActivatedAt: undefined });
      const actual = durationSinceLastActivatedAt(tab);

      expect(actual).toEqual(Duration.zero());
    });
  });
});
