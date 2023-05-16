import React from 'react'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { navigateToOptionsPage } from '../../repository/SettingsRepository'

const Header = () => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography
        style={{ color: 'white' }}
        variant="h6"
        component="h1"
        sx={{ flexGrow: 1 }}
      >
        TabTabTab
      </Typography>
      <IconButton
        onClick={() => navigateToOptionsPage()}
        color="inherit"
      >
        <SettingsIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
)

export default Header
