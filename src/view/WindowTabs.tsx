import React from 'react'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import WindowTab from './WindowTab'
import { TbWindow } from '../model/Window'
import { TbWindows } from '../model/Windows'

type WindowTabsProps = {
  selectedIndex: number,
  currentWindow: TbWindow,
  unfocusedWindows: TbWindows,
  onSelect: Function
}

const WindowTabs = (props: WindowTabsProps) => {
  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    props.onSelect(newValue)
  }

  const unfocusedWindows = props.unfocusedWindows.map((window, index) => {
    return <WindowTab key={window.id.value} label={`Window${index+1}`} tabCount={window.tabCount} />
  })

  return (
    <Box sx={{ maxWidth: 480, borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={props.selectedIndex}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
      >
        <WindowTab label="CurrentWindow" tabCount={props.currentWindow?.tabCount ?? 0} />
        {unfocusedWindows}
      </Tabs>
    </Box>
  )
}

export default WindowTabs
