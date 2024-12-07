import ExtensionIcon from "@mui/icons-material/Extension";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

type TabFaviconProps = {
  url: URL;
  style?: React.CSSProperties;
  size?: number;
  discarded?: boolean;
  isLoading?: boolean;
};

const TabFavicon = (props: TabFaviconProps) => {
  const { url, style, size = 20, discarded = false, isLoading = false } = props;
  const [isError, setIsError] = useState(false);
  const theme = useTheme();

  if (isLoading) {
    return <CircularProgress style={{ ...style }} size={size} />;
  }

  const accessibleUrl =
    url &&
    url.href !== "" &&
    (url.protocol === "https:" || url.protocol === "http:");
  const iconStyle = {
    ...style,
    border: discarded ? `2px dotted ${theme.palette.text.disabled}` : "none",
    borderRadius: discarded ? "50%" : "none",
    opacity: discarded ? 0.5 : 1,
  };

  if (accessibleUrl && !isError) {
    return (
      <Box
        component="img"
        style={iconStyle}
        sx={{
          height: size,
          width: size,
        }}
        src={url.href}
        loading="lazy"
        onError={() => setIsError(true)}
      />
    );
  }

  return (
    <ExtensionIcon
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
