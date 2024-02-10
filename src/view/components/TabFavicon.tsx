import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";

type TabFaviconProps = {
  url: URL;
  style?: React.CSSProperties;
  size?: number;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, style, size = 20 } = props;

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
          height: size,
          width: size,
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
        height: size,
        width: size,
      }}
    />
  );
};

export default TabFavicon;
