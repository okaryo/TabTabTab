import React, { useState } from 'react'
import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PushPin from '@mui/icons-material/PushPin'
import TabItem from './TabItem'
import { PinnedTabs } from '../../model/PinnedTabs'
import { TabId } from '../../model/TabId'
import { TbWindows } from '../../model/Windows'

type PinnedTabListProps = {
  windows: TbWindows,
  tabs: PinnedTabs,
  onRemoveTab: (tabId: TabId) => Promise<void>
}

const PinnedTabList = (props: PinnedTabListProps) => {
  const { windows, tabs, onRemoveTab } = props
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenStatus = () => setIsOpen(!isOpen)

  const tabComponents = tabs.map((tab) => {
    return <TabItem key={tab.id.value} windows={windows} tab={tab} sx={{ pl: 3, width: 395 }} onRemoveTab={onRemoveTab} />
  })

  return (
    <Stack direction="row">
      <Box style={{ borderRight: '5px solid #818181', borderRadius: '0 5px 5px 0' }} />
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        disablePadding
      >
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={toggleOpenStatus}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          }
          disablePadding
        >
          <ListItemButton onClick={toggleOpenStatus} sx={{ height: 56 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ListItemText
                primary={<Typography
                  variant="h6"
                  component="h6"
                  >
                    Pinned
                  </Typography>
                }
              />
              <PushPin fontSize="small" />
            </Stack>
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {tabComponents}
          </List>
        </Collapse>
      </List>
    </Stack>
  )
}

export default PinnedTabList
