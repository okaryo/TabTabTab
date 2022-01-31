import React, { useState } from 'react'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PushPin from '@mui/icons-material/PushPin'
import PinnedTabItem from './PinnedTabItem'
import { PinnedTabs } from '../model/PinnedTabs'

type PinnedTabListProps = {
  tabs: PinnedTabs
}

const PinnedTabList = (props: PinnedTabListProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenStatus = () => setIsOpen(!isOpen)

  const tabs = props.tabs.map((tab) => {
    return <PinnedTabItem key={tab.id.value} title={tab.title} favIconUrl={tab.favIconUrl} />
  })

  return (
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
        <ListItemButton onClick={toggleOpenStatus}>
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
