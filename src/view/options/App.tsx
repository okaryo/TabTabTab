import React from 'react'
import { AppBar, Container, Divider, Toolbar, Typography } from '@mui/material'
import Settings from './Settings'

export default function App() {
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            style={{color:'white'}}
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1 }}
          >
            Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Divider />

      <Container sx={{p: 2}} style={{maxWidth: '680px'}}>
        <Settings />
      </Container>

      <style>{`
        html, body {
          padding: 0;
          margin: 0;
        }
        * {
          box-sizing: border-box;
        }
      `} </style>
    </div>
  )
}
