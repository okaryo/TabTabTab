import React, { useState } from 'react'
import { Chip, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import GroupedTabItem from './GroupedTabItem'
import { GroupedTabs } from '../model/GroupedTabs'

type GroupedTabListProps = {
  tabs: GroupedTabs,
}

const GroupedTabList = (props: GroupedTabListProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpenStatus = () => setIsOpen(!isOpen)

  const tabs = props.tabs.map((tab) => {
    return <GroupedTabItem key={tab.id.value} title={tab.title} color={props.tabs.colorCode} favIconUrl={tab.favIconUrl} />
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
        <ListItemButton onClick={toggleOpenStatus} style={{ backgroundColor: props.tabs.colorCode }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ListItemText
              primary={<Typography
                variant="h6"
                component="h6"
                >
                  {props.tabs.name}
                </Typography>
              }
            />
            <Chip label="Group" size="small" color="info" />
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

export default GroupedTabList
