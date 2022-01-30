import React from 'react'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import WindowTab from './WindowTab'

type WindowTabsProps = {
  unfocusedWindowCount: number,
  selectedIndex: number,
  onSelect: Function

}

const WindowTabs = (props: WindowTabsProps) => {
  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    props.onSelect(newValue)
  }

  const unfocusedWindows = []
  for (let i = 0; i < props.unfocusedWindowCount; i++) {
    unfocusedWindows.push(<WindowTab key={i+1} label={`Window${i+1}`} />)
  }

  return (
    <Box sx={{ maxWidth: 480, borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={props.selectedIndex}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
      >
        <WindowTab label="CurrentWindow" />
        {unfocusedWindows}
      </Tabs>
    </Box>
  )
}

export default WindowTabs
