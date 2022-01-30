import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import WindowTab from './WindowTab'

type WindowTabsProps = {
  unfocusedWindowCount: number
}

const WindowTabs = (props: WindowTabsProps) => {
  const [, setState] = useState(0)
  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    setState(newValue)
  }

  const unfocusedWindows = []
  for (let i = 0; i < props.unfocusedWindowCount; i++) {
    unfocusedWindows.push(<WindowTab key={i} label={`Window${i+1}`} />)
  }

  return (
    <Box sx={{ maxWidth: 480, borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={0}
        onChange={onChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="basic tabs example"
      >
        <WindowTab label="CurrentWindow" />
        {unfocusedWindows}
      </Tabs>
    </Box>
  )
}

export default WindowTabs
