import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import t from "../../../../../i18n/Translations";

const Sponsor = () => {
  const BuyMeCoffeeButton = () => {
    return (
      <Link
        href="https://www.buymeacoffee.com/okaryo"
        target="_blank"
        sx={{
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          style={{
            height: 60,
            width: 217,
          }}
        />
      </Link>
    );
  };

  const GitHubButton = () => {
    const githubTheme = {
      light: {
        background: "#0d1117",
        text: "#ffffff",
        border: "#30363d",
      },
      dark: {
        background: "#ffffff",
        text: "#333333",
        border: "#dddddd",
      },
    };
    const theme = useTheme();
    const mode = theme.palette.mode;
    const buttonStyle = {
      backgroundColor: githubTheme[mode].background,
      color: githubTheme[mode].text,
      borderColor: githubTheme[mode].border,
      "&:hover": {
        opacity: 0.8,
        backgroundColor: githubTheme[mode].background,
        color: githubTheme[mode].text,
      },
    };

    return (
      <Button
        sx={{
          height: 60,
          borderRadius: 2,
          textTransform: "none",
          ...buttonStyle,
        }}
        variant="contained"
        startIcon={<GitHubIcon />}
        disableElevation
        href="https://github.com/sponsors/okaryo"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sponsor on GitHub
      </Button>
    );
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={8}
      sx={{
        p: 2,
        height: "calc(100vh - 64px)",
      }}
    >
      <Stack spacing={4} alignItems="center" justifyContent="center">
        <Typography variant="h2" component="h2">
          {`${t.sponsorPageHeader} ❤️`}
        </Typography>
        <Typography variant="subtitle1" component="p" textAlign="center">
          {t.sponsorPageDescription}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <BuyMeCoffeeButton />
        <GitHubButton />
      </Stack>
    </Stack>
  );
};

export default Sponsor;
