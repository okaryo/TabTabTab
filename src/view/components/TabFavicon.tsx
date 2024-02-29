import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

type TabFaviconProps = {
  url: URL;
  style?: React.CSSProperties;
  size?: number;
  discarded?: boolean;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, style, size = 20, discarded = false } = props;
  const theme = useTheme();
  const validUrl =
    url &&
    url.href !== "" &&
    (url.protocol === "https:" || url.protocol === "http:");

  if (validUrl) {
    return (
      <Box
        component="img"
        style={{
          ...style,
          border: discarded
            ? `2px dotted ${theme.palette.text.disabled}`
            : "none",
          borderRadius: discarded ? "50%" : "none",
          opacity: discarded ? 0.5 : 1,
        }}
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
