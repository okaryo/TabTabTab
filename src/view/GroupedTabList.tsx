import React, { useState } from 'react'
import { Chip, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import GroupedTabItem from './GroupedTabItem'

type GroupedTabListProps = {
  name: string,
}

const GroupedTabList = (props: GroupedTabListProps) => {
  const { name } = props
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
        <ListItemButton onClick={toggleOpenStatus} style={{ backgroundColor: 'yellow' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ListItemText primary={name} />
            <Chip label="Group" size="small" variant="outlined" />
          </Stack>
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List disablePadding>
          <GroupedTabItem name="GroupedTabItem" />
        </List>
      </Collapse>
    </List>
  )
}

export default GroupedTabList
