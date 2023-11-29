import { Duration } from "./Duration";
import { WindowId } from "./Window";

export type TabId = number;
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
  lastActivatedAt?: Date;
};

export const durationSinceLastActivatedAt = (tab: Tab): Duration => {
  if (!tab.lastActivatedAt) return Duration.zero();

  const currentTime = new Date();
  return new Duration({
    milliseconds: currentTime.getTime() - tab.lastActivatedAt.getTime(),
  });
};
