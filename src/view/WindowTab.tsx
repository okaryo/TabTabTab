
import React from 'react'
import Tab from '@mui/material/Tab'

type WindowTabProps = {
  label: string
}

const WindowTab = (props: WindowTabProps) => {
  const { label, ...other } = props
  return (
    <Tab
      style={{textTransform: 'none'}}
      label={label}
      {...other}
    />
  )
}
WindowTab.muiName = 'Tab'

export default WindowTab
