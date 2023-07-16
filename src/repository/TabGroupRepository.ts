import { GroupId } from "../model/GroupId";

export const collapseTabGroup = async (groupId: GroupId): Promise<void> => {
  await chrome.tabGroups.update(groupId.value, { collapsed: true });
};

export const expandTabGroup = async (groupId: GroupId): Promise<void> => {
  await chrome.tabGroups.update(groupId.value, { collapsed: false });
};
