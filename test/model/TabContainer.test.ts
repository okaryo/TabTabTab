import { GroupColor } from "../../src/model/GroupColor";
import {
  isPinned,
  isTab,
  isTabContainer,
  isTabGroup,
} from "../../src/model/TabContainer";

describe("#isTab", () => {
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
    {
      params: {
        id: 10000,
        title: "tab",
        url: new URL("https://example.com"),
        favIconUrl: new URL("https://example.com/favicon.ico"),
        highlighted: true,
        audible: true,
        pinned: true,
      },
      expected: true,
    },
  ])(
    "case %#: when params is $params, it should return $expected",
    ({ params, expected }) => {
      expect(isTab(params as any)).toBe(expected);
    },
  );
});

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
    {
      params: {
        id: 10000,
        title: "tab",
        url: new URL("https://example.com"),
        favIconUrl: new URL("https://example.com/favicon.ico"),
        highlighted: true,
        audible: true,
        pinned: true,
      },
      expected: false,
    },
  ])(
    "case %#: when params is $params, it should return $expected",
    ({ params, expected }) => {
      expect(isTabContainer(params as any)).toBe(expected);
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
    {
      params: {
        id: 10000,
        title: "tab",
        url: new URL("https://example.com"),
        favIconUrl: new URL("https://example.com/favicon.ico"),
        highlighted: true,
        audible: true,
        pinned: true,
      },
      expected: false,
    },
  ])(
    "case %#: when params is $params, it should return $expected",
    ({ params, expected }) => {
      expect(isPinned(params as any)).toBe(expected);
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
    {
      params: {
        id: 10000,
        title: "tab",
        url: new URL("https://example.com"),
        favIconUrl: new URL("https://example.com/favicon.ico"),
        highlighted: true,
        audible: true,
        pinned: true,
      },
      expected: false,
    },
  ])(
    "case %#: when params is $params, it should return $expected",
    ({ params, expected }) => {
      expect(isTabGroup(params as any)).toBe(expected);
    },
  );
});
