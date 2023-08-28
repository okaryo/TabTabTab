import { Duration } from "./Duration";

export type TabId = number;
export type Tab = {
  id: TabId;
  groupId?: number;
  windowId?: number;
  title: string;
  url: URL;
  favIconUrl?: URL;
  highlighted: boolean;
  audible: boolean;
  pinned: boolean;
  lastActivatedAt?: Date;
};

export const durationSinceLastActivatedAt = (tab: Tab): Duration => {
  if (!tab.lastActivatedAt) return Duration.zero();

  const currentTime = new Date();
  return new Duration({
    milliseconds: currentTime.getTime() - tab.lastActivatedAt.getTime(),
  });
};

export const updateLastActivatedAt = (tab: Tab, lastActivatedAt: Date): Tab => {
  return {
    ...tab,
    lastActivatedAt,
  };
};
