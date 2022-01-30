
import React from 'react'
import Tab from '@mui/material/Tab'

type WindowTabProps = {
  label: string
}

const WindowTab = (props: WindowTabProps) => {
  const { label } = props
  return (
    <Tab
      style={{textTransform: 'none'}}
      label={label}
    />
  )
}

export default WindowTab
