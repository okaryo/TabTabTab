import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          style={{color:'white'}}
          variant="h6"
          component="h1"
          sx={{ flexGrow: 1 }}
        >
          TabTabTab
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
