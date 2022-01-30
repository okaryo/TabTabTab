import React from 'react'
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'

import Clear from '@mui/icons-material/Clear'

type TabItemProps = {
  title: string
}

const TabItem = (props: TabItemProps) => {
  const { title } = props

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  )
}

export default TabItem
