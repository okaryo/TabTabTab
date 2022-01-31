import React, { useState } from 'react'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PushPin from '@mui/icons-material/PushPin'
import { PinnedTabs } from '../model/PinnedTabs'
import TabItem from './TabItem'

type PinnedTabListProps = {
  tabs: PinnedTabs
}

const PinnedTabList = (props: PinnedTabListProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenStatus = () => setIsOpen(!isOpen)

  const tabs = props.tabs.map((tab) => {
    return <TabItem key={tab.id.value} tab={tab} sx={{ pl: 3 }} />
  })

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      style={{borderLeft: "5px solid #818181"}}
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
          {tabs}
        </List>
      </Collapse>
    </List>
  )
}

export default PinnedTabList
