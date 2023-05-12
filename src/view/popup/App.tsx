import React, { useState, useEffect } from 'react'
import { TbWindows } from '../../model/Windows'
import { Box } from '@mui/system'
import { CssBaseline } from '@mui/material'
import Header from './Header'
import WindowTabs from './WindowTabs'
import TabList from './TabList'
import { TabId } from '../../model/TabId'
import { getWindows } from '../../repository/WindowsRepository'
import { removeTab } from '../../repository/TabsRepository'

export default function App() {
  const [windowsState, setWindowsState] = useState(TbWindows.empty())
  useEffect(() => {
    const setWindows = async () => {
      setWindowsState(await getWindows())
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setWindows()
  }, [])

  const onRemoveTab = async (tabId: TabId) => {
    await removeTab(tabId)
    const newWindows = windowsState.removeTabBy(tabId)
    setWindowsState(newWindows)
  }

  const [selectedIndex, setSelectedIndex] = useState(0)
  const unfocusedWindowsTabList = windowsState.unfocusedWindows.map((window, index) => {
    return (
      <div
        key={window.id.value}
        role="tabpanel"
        hidden={selectedIndex !== index+1}
        id={`simple-tabpanel-${index+1}`}
        aria-labelledby={`simple-tab-${index+1}`}
      >
        {selectedIndex === index+1 && (
          <TabList windows={windowsState} tabs={window.tabs} onRemoveTab={onRemoveTab} />
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
          <TabList windows={windowsState} tabs={windowsState.focusedWindowTabs} onRemoveTab={onRemoveTab} />
        )}
      </div>
  )

  return (
    <div>
      <CssBaseline />
      <Box sx={{ width: 400 }} >
        <Header />
        <WindowTabs
          currentWindow={windowsState.currentWindow}
          unfocusedWindows={windowsState.unfocusedWindows}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
        />
        {focusedWindowsTabList}
        {unfocusedWindowsTabList}
      </Box>
    </div>
  )
}
