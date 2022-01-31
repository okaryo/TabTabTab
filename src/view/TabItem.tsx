import React from 'react'
import { Box, IconButton, ListItem, ListItemButton, ListItemText, SxProps, Typography } from '@mui/material'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import Clear from '@mui/icons-material/Clear'
import MoveToTabUseCase from '../usecase/MoveToTabUseCase'
import RemoveTabUseCase from '../usecase/RemoveTabUseCase'
import { Tab } from '../model/Tab'

type TabItemProps = {
  tab: Tab,
  sx?: SxProps
}

const TabItem = (props: TabItemProps) => {
  const { tab, sx } = props
  const onTap = () => MoveToTabUseCase(tab.id)

  let favIcon
  const favIconUrl = tab.favIconUrl
  if (favIconUrl !== undefined && (favIconUrl.startsWith('https') || favIconUrl.startsWith('http'))) {
    favIcon = (
      <Box
        component="img"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
        alt={tab.title}
        src={favIconUrl}
      />
    )
  } else {
    favIcon = (
      <BrokenImageIcon
        color="disabled"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
      />
    )
  }

  const onClickDeleteButton = () => RemoveTabUseCase(tab.id)

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={onClickDeleteButton}>
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton sx={{ width: 400, ...sx }} onClick={onTap} color="info" selected={tab.isFocused}>
        {favIcon}
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ letterSpacing: 0 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            >
              {tab.title}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  )
}

export default TabItem
