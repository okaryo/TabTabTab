import React from "react";
import { List } from "@mui/material";
import TabItem from "./TabItem";
import GroupedTabList from "./GroupedTabList";
import PinnedTabList from "./PinnedTabList";
import { Tabs } from "../../model/Tabs";
import { PinnedTabs } from "../../model/PinnedTabs";
import { GroupedTabs } from "../../model/GroupedTabs";
import { TabId } from "../../model/TabId";
import { Tab } from "../../model/Tab";
import { TbWindows } from "../../model/Windows";

type TabListProps = {
  windows: TbWindows;
  tabs: Tabs;
  onRemoveTab: (tabId: TabId) => Promise<void>;
};

const TabList = (props: TabListProps) => {
  const { windows, tabs, onRemoveTab } = props;

  const tabsComponent = tabs.map((tab) => {
    if (tab instanceof PinnedTabs)
      return (
        <PinnedTabList
          key={tab.toString()}
          windows={windows}
          tabs={tab}
          onRemoveTab={onRemoveTab}
        />
      );
    if (tab instanceof GroupedTabs)
      return (
        <GroupedTabList
          key={tab.name}
          windows={windows}
          tabs={tab}
          onRemoveTab={onRemoveTab}
        />
      );

    return (
      <TabItem
        key={(tab as Tab).id.value}
        windows={windows}
        tab={tab as Tab}
        sx={{}}
        onRemoveTab={onRemoveTab}
      />
    );
  });

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
      {tabsComponent}
    </List>
  );
};

export default TabList;
