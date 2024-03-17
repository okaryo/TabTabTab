import { closeTabs } from "../../data/repository/TabsRepository";
import { type Tab, isSamePageTabs } from "../../model/Tab";
import { type Window, flatTabsInWindows } from "../../model/Window";

export const resolveDuplicatedTabs = async (
  windows: Window[],
  targetTab: Tab,
) => {
  const allTabs = flatTabsInWindows(windows);
  const duplicateTabs = allTabs.filter(
    (tab) => tab.id !== targetTab.id && isSamePageTabs(tab, targetTab),
  );
  const duplicateTabIds = duplicateTabs.map((t) => t.id);
  await closeTabs(duplicateTabIds);
};
