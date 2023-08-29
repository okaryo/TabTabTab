import { Tab } from "../../src/model/Tab";

export const mockTab = (attrs: Partial<Tab> = {}): Tab => {
  return {
    id: 1,
    groupId: 1,
    windowId: 1,
    title: "title",
    url: new URL("https://example.com"),
    favIconUrl: new URL("https://example.com/favicon.ico"),
    highlighted: false,
    audible: false,
    pinned: false,
    lastActivatedAt: new Date(),
    ...attrs,
  };
};
