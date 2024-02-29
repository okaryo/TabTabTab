import TabIcon from "@mui/icons-material/Tab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

type TabFaviconProps = {
  url: URL;
  style?: React.CSSProperties;
  size?: number;
  discarded?: boolean;
  isLoading?: boolean;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, style, size = 20, discarded = false, isLoading = false } = props;
  const theme = useTheme();

  if (isLoading) {
    return <CircularProgress style={{ ...style }} size={size} />;
  }

  const validUrl =
    url &&
    url.href !== "" &&
    (url.protocol === "https:" || url.protocol === "http:");
  const iconStyle = {
    ...style,
    border: discarded ? `2px dotted ${theme.palette.text.disabled}` : "none",
    borderRadius: discarded ? "50%" : "none",
    opacity: discarded ? 0.5 : 1,
  };

  if (validUrl) {
    return (
      <Box
        component="img"
        style={iconStyle}
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
      style={iconStyle}
      sx={{
        height: size,
        width: size,
      }}
    />
  );
};

export default TabFavicon;
