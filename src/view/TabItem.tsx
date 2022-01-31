import React from 'react'
import { Box, IconButton, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import BrokenImageIcon from '@mui/icons-material/BrokenImage'
import Clear from '@mui/icons-material/Clear'
import { TabId } from '../model/TabId'
import MoveToTabUseCase from '../usecase/MoveToTabUseCase'
import RemoveTabUseCase from '../usecase/RemoveTabUseCase'

type TabItemProps = {
  tabId: TabId,
  title: string,
  favIconUrl: string
}

const TabItem = (props: TabItemProps) => {
  const { tabId, title, favIconUrl } = props
  const onTap = () => MoveToTabUseCase(tabId)

  let favIcon
  if (favIconUrl !== undefined && (favIconUrl.startsWith('https') || favIconUrl.startsWith('http'))) {
    favIcon = (
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

  const onClickDeleteButton = () => RemoveTabUseCase(tabId)

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={onClickDeleteButton}>
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton sx={{ width: 400 }} onClick={onTap}>
        {favIcon}
        <ListItemText
          primary={
            <Typography
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

export default TabItem
