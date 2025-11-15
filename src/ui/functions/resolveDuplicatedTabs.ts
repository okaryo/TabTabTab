import { isSamePageTabs, type Tab } from "../../model/Tab";
import { flatTabsInWindows, type Window } from "../../model/Window";
import { closeTabs } from "../../platform/repository/TabsRepository";

const resolveDuplicatedTabs = async (windows: Window[], targetTab: Tab) => {
  const allTabs = flatTabsInWindows(windows);
  const duplicateTabs = allTabs.filter(
    (tab) => tab.id !== targetTab.id && isSamePageTabs(tab, targetTab),
  );
  const duplicateTabIds = duplicateTabs.map((t) => t.id);
  await closeTabs(duplicateTabIds);
};

export default resolveDuplicatedTabs;
