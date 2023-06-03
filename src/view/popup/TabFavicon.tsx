import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";
import React from "react";

type TabFaviconProps = {
  url: string;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url } = props;

  if (
    url !== null &&
    url !== undefined &&
    url !== "" &&
    (url.startsWith("https") || url.startsWith("http"))
  ) {
    return (
      <Box
        component="img"
        sx={{
          height: 20,
          width: 20,
          marginRight: 2,
        }}
        src={url}
      />
    );
  }

  return (
    <TabIcon
      color="disabled"
      sx={{
        height: 20,
        width: 20,
        marginRight: 2,
      }}
    />
  );
};

export default TabFavicon;
