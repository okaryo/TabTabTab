import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";

type TabFaviconProps = {
  url: URL;
  style?: React.CSSProperties;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, style } = props;

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
