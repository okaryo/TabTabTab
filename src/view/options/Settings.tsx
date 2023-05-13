import React from 'react'
import TabCleanerSettingForm from './TabCleanerSettingForm'
import { Divider, Link, Typography } from '@mui/material'

const Settings = () => {
  return (
    <>
      <TabCleanerSettingForm />

      <Divider sx={{ mt: 2, mb: 2 }} />

      <Typography
        variant="caption"
        component="p"
      >
        If you find TabTabTab helpful, we would greatly appreciate it if you could leave us a review on the&nbsp;
        <Link
          href="https://chrome.google.com/webstore/detail/tabtabtab/hfmnidllojimehmfjkclnadpebibhgoi"
          target="_blank"
          rel="noopener noreferrer"
        >
        Chrome Store
        </Link>
        ! Your voice greatly contributes to the development of TabTabTab.
      </Typography>
    </>
  )
}

export default Settings
