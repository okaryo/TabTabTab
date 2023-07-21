import DoneIcon from "@mui/icons-material/Done";
import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";
import React from "react";

type TabFaviconProps = {
  url: URL;
  shouldShowCheckIcon: boolean;
  style?: React.CSSProperties;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, shouldShowCheckIcon, style } = props;

  if (shouldShowCheckIcon) {
    return (
      <DoneIcon
        style={{ ...style }}
        sx={{
          height: 20,
          width: 20,
          color: "success.main",
        }}
      />
    );
  }

  if (
    url !== null &&
    url !== undefined &&
    url.href !== "" &&
    (url.protocol === "https:" || url.protocol === "http:")
  ) {
    return (
      <Box
        component="img"
        style={{ ...style }}
        sx={{
          height: 20,
          width: 20,
        }}
        src={url.href}
      />
    );
  }

  return (
    <TabIcon
      color="disabled"
      style={{ ...style }}
      sx={{
        height: 20,
        width: 20,
      }}
    />
  );
};

export default TabFavicon;
