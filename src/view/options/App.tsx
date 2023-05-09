import React from 'react'
import { Box, Container, Divider, Typography } from '@mui/material'
import Settings from './Settings'

export default function App() {
  return (
    <div>
      <Container sx={{pl: 2, pr: 2}}>
        <Box>
          <Typography
            variant='h6'
            component='h1'
            style={{display: 'flex', alignItems: 'center'}}
            sx={{height: 54}}
          >
            TabTabTab
          </Typography>
        </Box>
      </Container>

      <Divider />

      <Container sx={{p: 2}}>
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
