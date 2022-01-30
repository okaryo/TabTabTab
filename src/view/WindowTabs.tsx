import React, { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import WindowTab from './WindowTab'

const WindowTabs = () => {
  const [, setState] = useState(0)
  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    setState(newValue)
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
        <WindowTab label="Window1" />
        <WindowTab label="Window2" />
        <WindowTab label="Window3" />
        <WindowTab label="Window4" />
      </Tabs>
    </Box>
  )
}

export default WindowTabs
