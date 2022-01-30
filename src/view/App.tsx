import React, { useState, useEffect } from 'react'
import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TbWindows } from '../model/Windows'
import { Box } from '@mui/system'
import { CssBaseline } from '@mui/material'
import Header from './Header'
import WindowTabs from './WindowTabs'
import TabList from './TabList'

export default function App() {
  const [, setStates] = useState(TbWindows.empty())
  useEffect(() => {
    const getWindows = async () => {
      const windows = await ChromeTabsAPI.getWindows()
      setStates(windows)
    }
    getWindows()
  }, [])

  return (
    <div>
      <CssBaseline />
      <Box sx={{ width: 400, height: 400, }} >
        <Header />
        <WindowTabs />
        <TabList />
      </Box>
    </div>
  )
}
