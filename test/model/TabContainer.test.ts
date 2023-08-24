import { GroupColor } from "../../src/model/GroupColor";
import {
  TabContainer,
  isPinned,
  isTabContainer,
  isTabGroup,
} from "../../src/model/TabContainer";

describe("#isTabContainer", () => {
  it.each([
    { params: { id: "pinned", children: [] }, expected: true },
    { params: { id: "pinned" }, expected: false },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
        children: [],
      },
      expected: true,
    },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
      },
      expected: false,
    },
  ])(
    `case %#: when params is $params, it should return $expected`,
    ({ params, expected }) => {
      expect(isTabContainer(params as TabContainer)).toBe(expected);
    },
  );
});

describe("#isPinned", () => {
  it.each([
    { params: { id: "pinned", children: [] }, expected: true },
    { params: { id: "pinned" }, expected: false },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
        children: [],
      },
      expected: false,
    },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
      },
      expected: false,
    },
  ])(
    `case %#: when params is $params, it should return $expected`,
    ({ params, expected }) => {
      expect(isPinned(params as TabContainer)).toBe(expected);
    },
  );
});

describe("#isTabGroup", () => {
  it.each([
    { params: { id: "pinned", children: [] }, expected: false },
    { params: { id: "pinned" }, expected: false },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
        children: [],
      },
      expected: true,
    },
    {
      params: {
        id: 10000,
        name: "group",
        color: new GroupColor("red"),
        collapsed: true,
      },
      expected: false,
    },
  ])(
    `case %#: when params is $params, it should return $expected`,
    ({ params, expected }) => {
      expect(isTabGroup(params as TabContainer)).toBe(expected);
    },
  );
});
