import React from 'react'
import { List } from '@mui/material'
import TabItem from './TabItem'
import GroupedTabList from './GroupedTabList'
import PinnedTabList from './PinnedTabList'
import { Tabs } from '../model/Tabs'
import { PinnedTabs } from '../model/PinnedTabs'

import { GroupedTabs } from '../model/GroupedTabs'

type TabListProps = {
  tabs: Tabs
}

const TabList = (props: TabListProps) => {
  const tabs = props.tabs.map((tab) => {
    if (tab instanceof PinnedTabs) return <PinnedTabList key={tab.toString()} tabs={tab} />
    if (tab instanceof GroupedTabs) return <GroupedTabList key={tab.name} tabs={tab} />

    return <TabItem key={tab.id.value} tab={tab} sx={{}} />
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
