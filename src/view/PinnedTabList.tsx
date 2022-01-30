import React, { useState } from 'react'
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PushPin from '@mui/icons-material/PushPin'
import PinnedTabItem from './PinnedTabItem'

const PinnedTabList = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenStatus = () => setIsOpen(!isOpen)

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
            <ListItemText primary="Pinned" />
            <PushPin />
          </Stack>
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          <PinnedTabItem name="PinnedTabItem" />
        </List>
      </Collapse>
    </List>
  )
}

export default PinnedTabList
