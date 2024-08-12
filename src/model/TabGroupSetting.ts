export type TabGroupSetting = {
  enabledAutoGrouping: boolean;
  collapseWhenNoInUse: boolean;
  ungroupSingleTabGroups: boolean;
  applyAutoGroupingToCurrentTabOnly: boolean;
  sortGroupsAlphabetically: boolean;
  groupBy: "domain" | "subdomain";
};

export const defaultTabGroupSetting: TabGroupSetting = {
  enabledAutoGrouping: false,
  collapseWhenNoInUse: false,
  ungroupSingleTabGroups: true,
  applyAutoGroupingToCurrentTabOnly: false,
  sortGroupsAlphabetically: false,
  groupBy: "domain" as const,
};
