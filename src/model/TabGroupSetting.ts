export type TabGroupSetting = {
  enabledAutoGrouping: boolean;
  collapseWhenNoInUse: boolean;
  ungroupSingleTabGroups: boolean;
  limitAutoGroupingTargetToActiveTab: boolean;
  groupBy: "domain" | "subdomain";
};

export const defaultTabGroupSetting: TabGroupSetting = {
  enabledAutoGrouping: false,
  collapseWhenNoInUse: false,
  ungroupSingleTabGroups: true,
  limitAutoGroupingTargetToActiveTab: false,
  groupBy: "domain" as const,
};
