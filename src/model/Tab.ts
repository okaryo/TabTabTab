import { Duration } from "./Duration";
import { Window, isTabContainer } from "./Window";

export type Tab = {
  id: number;
  groupId?: number;
  windowId?: number;
  title: string;
  url: URL;
  favIconUrl?: URL;
  highlighted: boolean;
  audible: boolean;
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
  windows: Window[],
  targetTab: Tab,
): boolean => {
  const isDupulicated = (a: Tab, b: Tab): boolean => {
    return a.id !== b.id && a.title === b.title && a.url.href === b.url.href;
  };

  return windows.some((window) => {
    return window.children.some((child) => {
      if (isTabContainer(child)) {
        return child.children.some((tab) => isDupulicated(tab, targetTab));
      }
      return isDupulicated(child, targetTab);
    });
  });
};
