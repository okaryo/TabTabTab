import React from 'react'
import { List } from '@mui/material'


import TabItem from './TabItem'
import GroupedTabList from './GroupedTabList'
import PinnedTabList from './PinnedTabList'

const TabList = () => {
  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      disablePadding
    >
      <TabItem title="Normal Tab" />
      <GroupedTabList name="GroupedTabList" />
      <PinnedTabList />
    </List>
  )
}

export default TabList
