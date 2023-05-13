import React from 'react'
import TabCleanerSettingForm from './TabCleanerSettingForm'
import { Divider } from '@mui/material'
import Footer from './Footer'

const Settings = () => {
  return (
    <>
      <TabCleanerSettingForm />
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Footer />
    </>
  )
}

export default Settings
