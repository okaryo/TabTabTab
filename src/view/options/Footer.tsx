import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Link
        href="https://github.com/okaryo/TabTabTab"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
        sx={{ mb: 1 }}
      >
        <Stack direction="row">
          <GitHubIcon sx={{ mr: 1 }} />
          <Typography>Source Code</Typography>
        </Stack>
      </Link>
      <Typography
        variant="caption"
        component="p"
        style={{ textAlign: "center" }}
      >
        If you find TabTabTab helpful, we would greatly appreciate it if you
        could leave us a review on the&nbsp;
        <Link
          href="https://chrome.google.com/webstore/detail/tabtabtab/hfmnidllojimehmfjkclnadpebibhgoi"
          target="_blank"
          rel="noopener noreferrer"
        >
          ChromeWebStore
        </Link>
        ! Your voice greatly contributes to the development of TabTabTab.
      </Typography>
    </Box>
  );
};

export default Footer;
