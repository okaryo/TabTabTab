import Chip from "@mui/material/Chip";
import Tab from "@mui/material/Tab";
import React from "react";

type WindowTabProps = {
  label: string;
  tabCount: number;
};

const WindowTab = (props: WindowTabProps) => {
  const { label, tabCount, ...other } = props;
  return (
    <Tab
      style={{ textTransform: "none", minHeight: "auto", padding: 12 }}
      label={label}
      {...other}
      icon={<Chip label={tabCount} size="small" color="info" />}
      iconPosition="end"
    />
  );
};
WindowTab.muiName = "Tab";

export default WindowTab;
