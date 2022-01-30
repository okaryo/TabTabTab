import React from 'react'
import { Box, IconButton, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import Clear from '@mui/icons-material/Clear'

type GroupedTabItemProps = {
  title: string,
  color: string,
  favIconUrl: string
}

const GroupedTabItem = (props: GroupedTabItemProps) => {
  const { title, color, favIconUrl } = props

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton style={{ borderLeft: `10px solid ${color}`, width: 400 }}>
        <Box
          component="img"
          sx={{
            height: 20,
            width: 20,
            marginRight: 2,
          }}
          alt={title}
          src={favIconUrl}
        />
        <ListItemText
          primary={<Typography
            variant="subtitle1"
            component="p"
            sx={{ letterSpacing: 0 }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            >
              {title}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}

export default GroupedTabItem
