export type TabGroupSetting = {
  enabledAutoGrouping: boolean;
  collapseWhenNoInUse: boolean;
  ungroupSingleTabGroups: boolean;
  applyAutoGroupingToCurrentTabOnly: boolean;
  groupBy: "domain" | "subdomain";
};

export const defaultTabGroupSetting: TabGroupSetting = {
  enabledAutoGrouping: false,
  collapseWhenNoInUse: false,
  ungroupSingleTabGroups: true,
  applyAutoGroupingToCurrentTabOnly: false,
  groupBy: "domain" as const,
};
