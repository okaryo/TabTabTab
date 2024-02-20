export type TabGroupSetting = {
  enabledAutoGrouping: boolean;
  collapseWhenNoInUse: boolean;
  ungroupSingleTabGroups: boolean;
  groupBy: "domain" | "subdomain";
};

export const defaultTabGroupSetting: TabGroupSetting = {
  enabledAutoGrouping: false,
  collapseWhenNoInUse: false,
  ungroupSingleTabGroups: true,
  groupBy: "domain" as const,
};