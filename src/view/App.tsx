import React, { useState, useEffect } from 'react'
import { TbWindows } from '../model/Windows'
import { Box } from '@mui/system'
import { CssBaseline } from '@mui/material'
import Header from './Header'
import WindowTabs from './WindowTabs'
import TabList from './TabList'
import GetWindowsUseCase from '../usecase/GetWindowsUseCase'

export default function App() {
  const [state, setStates] = useState(TbWindows.empty())
  useEffect(() => {
    const getWindows = async () => {
      const windows = await GetWindowsUseCase()
      setStates(windows)
    }
    getWindows()
  }, [])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const unfocusedWindowsTabList = state.unfocusedWindows.map((window, index) => {
    return (
      <div
        key={window.id.value}
        role="tabpanel"
        hidden={selectedIndex !== index+1}
        id={`simple-tabpanel-${index+1}`}
        aria-labelledby={`simple-tab-${index+1}`}
      >
        {selectedIndex === index+1 && (
          <TabList tabs={window.tabs} />
        )}
      </div>
    )
  })

  const focusedWindowsTabList = (
      <div
        role="tabpanel"
        hidden={selectedIndex !== 0}
        id={'simple-tabpanel-0'}
        aria-labelledby={'simple-tab-0'}
      >
        {selectedIndex === 0 && (
          <TabList tabs={state.focusedWindowTabs} />
        )}
      </div>
  )

  return (
    <div>
      <CssBaseline />
      <Box sx={{ width: 400, height: 400 }} >
        <Header />
        <WindowTabs
          unfocusedWindowCount={state.unforcusedWindowCount}
          onSelect={setSelectedIndex}
          selectedIndex={selectedIndex}
        />
        {focusedWindowsTabList}
        {unfocusedWindowsTabList}
      </Box>
    </div>
  )
}
