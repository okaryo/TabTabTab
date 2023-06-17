import List from "@mui/material/List";
import React, { useContext } from "react";

import { GroupedTabs } from "../../../../model/GroupedTabs";
import { PinnedTabs } from "../../../../model/PinnedTabs";
import { Tab } from "../../../../model/Tab";
import { Tabs } from "../../../../model/Tabs";
import { WindowsContext } from "../contexts/Windows";

import GroupedTabList from "./GroupedTabList";
import PinnedTabList from "./PinnedTabList";
import TabItem from "./TabItem";

type TabListProps = {
  selectedWindowIndex: number;
};

const TabList = (props: TabListProps) => {
  const { selectedWindowIndex } = props;
  const { windows } = useContext(WindowsContext);

  let tabs = Tabs.empty();
  if (selectedWindowIndex === 0) {
    tabs = windows.focusedWindowTabs;
  } else {
    tabs = windows.unfocusedWindows.values[selectedWindowIndex - 1].tabs;
  }

  const tabsComponent = tabs.map((tab) => {
    if (tab instanceof PinnedTabs) {
      return <PinnedTabList key={tab.toString()} tabs={tab} />;
    }
    if (tab instanceof GroupedTabs) {
      return <GroupedTabList key={tab.name} tabs={tab} />;
    }

    return <TabItem key={(tab as Tab).id.value} tab={tab as Tab} />;
  });

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }} disablePadding>
      {tabsComponent}
    </List>
  );
};

export default TabList;
