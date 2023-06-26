import { Duration } from "./Duration";
import { TabId } from "./TabId";
import { WindowId } from "./WindowId";
import { Windows } from "./Windows";

export type Tab = {
  id: TabId;
  windowId: WindowId;
  title: string;
  url: URL;
  favIconUrl: string;
  isFocused: boolean;
  isAudioPlaying: boolean;
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

export const hasDuplicatedTabs = (
  windows: Windows,
  targetTab: Tab
): boolean => {
  return windows.values.some((window) => {
    return window.flatTabs.some(
      (tab) =>
        !targetTab.id.equalTo(tab.id) &&
        targetTab.title === tab.title &&
        targetTab.url.href === tab.url.href
    );
  });
};
