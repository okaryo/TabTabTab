import React from 'react'
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Clear from '@mui/icons-material/Clear'

type GroupedTabItemProps = {
  name: string,
}

const GroupedTabItem = (props: GroupedTabItemProps) => {
  const { name } = props

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton style={{ borderLeft: '10px solid yellow' }}>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  )
}

export default GroupedTabItem
