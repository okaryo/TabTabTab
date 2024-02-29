import { Duration } from "./Duration";
import { WindowId } from "./Window";

export type TabId = number;
export type TabStatus = "unloaded" | "loading" | "complete";
export type Tab = {
  id: TabId;
  groupId?: number;
  windowId?: WindowId;
  title: string;
  url: URL;
  favIconUrl?: URL;
  highlighted: boolean;
  audible: boolean;
  pinned: boolean;
  discarded: boolean;
  status?: TabStatus;
  lastActivatedAt?: Date;
};
export type StoredTab = Pick<Tab, "title" | "url" | "favIconUrl"> & {
  type: "tab";
  internalUid: string;
};

export const durationSinceLastActivatedAt = (tab: Tab): Duration => {
  if (!tab.lastActivatedAt) return Duration.zero();

  const currentTime = new Date();
  return new Duration({
    milliseconds: currentTime.getTime() - tab.lastActivatedAt.getTime(),
  });
};

export const isSamePageTabs = (tab1: Tab, tab2: Tab): boolean => {
  return tab1.title === tab2.title && tab1.url.href === tab2.url.href;
};
