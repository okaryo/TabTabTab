import React from 'react'
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Clear from '@mui/icons-material/Clear'

type PinnedTabItemProps = {
  name: string,
}

const PinnedTabItem = (props: PinnedTabItemProps) => {
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
      <ListItemButton sx={{ pl: 4 }}>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  )
}

export default PinnedTabItem
