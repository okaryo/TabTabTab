import React, { ReactElement } from 'react'
import { Box, IconButton, ListItem, ListItemButton, ListItemText, SxProps, Typography } from '@mui/material'
import TabIcon from '@mui/icons-material/Tab'
import Clear from '@mui/icons-material/Clear'
import MoveToTabUseCase from '../usecase/MoveToTabUseCase'
import { Tab } from '../model/Tab'
import { TabId } from '../model/TabId'

type TabItemProps = {
  tab: Tab,
  sx?: SxProps,
  onRemoveTab: (tabId: TabId) => void
}

const TabItem = (props: TabItemProps) => {
  const { tab, sx, onRemoveTab } = props
  const onTapTabItem = () => MoveToTabUseCase(tab.id)

  let favIcon: ReactElement
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
        src={favIconUrl}
      />
    )
  } else {
    favIcon = (
      <TabIcon
        color="disabled"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
      />
    )
  }

  const onClickDeleteButton = () => onRemoveTab(tab.id)

  return (
    <ListItem
      secondaryAction={
        <IconButton edge="end" aria-label="delete" onClick={onClickDeleteButton}>
          <Clear />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton sx={{ width: 400, pt: 0, pb: 0, ...sx }} onClick={onTapTabItem} color="info" selected={tab.isFocused}>
        {favIcon}
        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ letterSpacing: 0, fontSize: 14 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
            >
              {tab.title}
            </Typography>
          }
          secondary={tab.originUrl}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default TabItem
