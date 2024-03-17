import type { Tab } from "../../src/model/Tab";

export const mockTab = (attrs: Partial<Tab> = {}): Tab => {
  return {
    id: 1,
    groupId: 1,
    windowId: 1,
    title: "title",
    url: new URL("https://example.com"),
    favIconUrl: new URL("https://example.com/favicon.ico"),
    active: false,
    audible: false,
    pinned: false,
    discarded: false,
    lastActivatedAt: new Date(),
    ...attrs,
  };
};
