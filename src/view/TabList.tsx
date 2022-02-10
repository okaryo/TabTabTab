import React from 'react'
import { List } from '@mui/material'
import TabItem from './TabItem'
import GroupedTabList from './GroupedTabList'
import PinnedTabList from './PinnedTabList'
import { Tabs } from '../model/Tabs'
import { PinnedTabs } from '../model/PinnedTabs'
import { GroupedTabs } from '../model/GroupedTabs'
import { TabId } from '../model/TabId'
import { Tab } from '../model/Tab'

type TabListProps = {
  tabs: Tabs,
  onRemoveTab: (tabId: TabId) => void
}

const TabList = (props: TabListProps) => {
  const tabs = props.tabs.map((tab) => {
    if (tab instanceof PinnedTabs) return <PinnedTabList key={tab.toString()} tabs={tab} onRemoveTab={props.onRemoveTab} />
    if (tab instanceof GroupedTabs) return <GroupedTabList key={tab.name} tabs={tab} onRemoveTab={props.onRemoveTab} />

    return <TabItem key={(tab as Tab).id.value} tab={tab as Tab} sx={{}} onRemoveTab={props.onRemoveTab} />
  })

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      disablePadding
    >
      {tabs}
    </List>
  )
}

export default TabList
