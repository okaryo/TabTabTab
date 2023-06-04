import List from "@mui/material/List";
import React from "react";

import { GroupedTabs } from "./../../../model/GroupedTabs";
import { PinnedTabs } from "./../../../model/PinnedTabs";
import { Tab } from "./../../../model/Tab";
import { TabId } from "./../../../model/TabId";
import { Tabs } from "./../../../model/Tabs";
import { TbWindows } from "./../../../model/Windows";
import GroupedTabList from "./GroupedTabList";
import PinnedTabList from "./PinnedTabList";
import TabItem from "./TabItem";

type TabListProps = {
  windows: TbWindows;
  tabs: Tabs;
  onRemoveTab: (tabId: TabId) => Promise<void>;
};

const TabList = (props: TabListProps) => {
  const { windows, tabs, onRemoveTab } = props;

  const tabsComponent = tabs.map((tab) => {
    if (tab instanceof PinnedTabs) {
      return (
        <PinnedTabList
          key={tab.toString()}
          windows={windows}
          tabs={tab}
          onRemoveTab={onRemoveTab}
        />
      );
    }
    if (tab instanceof GroupedTabs) {
      return (
        <GroupedTabList
          key={tab.name}
          windows={windows}
          tabs={tab}
          onRemoveTab={onRemoveTab}
        />
      );
    }

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
