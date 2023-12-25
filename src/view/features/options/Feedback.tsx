import LaunchIcon from "@mui/icons-material/Launch";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import t from "../../../i18n/Translations";

const Feedback = () => {
  const feedbacks = [
    {
      title: t.bugReportAndFeatureRequestTitle,
      description: t.bugReportAndFeatureRequestDescription,
      link: "https://github.com/okaryo/TabTabTab/issues",
    },
    {
      title: t.storeReviewTitle,
      description: t.storeReviewDescription,
      link: "https://chrome.google.com/webstore/detail/tabtabtab/hfmnidllojimehmfjkclnadpebibhgoi",
    },
    {
      title: t.sourceCodeTitle,
      description: t.sourceCodeDescription,
      link: "https://github.com/okaryo/TabTabTab",
    },
  ];

  return (
    <Stack spacing={2}>
      {feedbacks.map((feedback, index) => {
        return (
          <CardActionArea>
            <Link
              key={index}
              href={feedback.link}
              underline="none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card sx={{ p: 2 }}>
                <CardHeader
                  sx={{ p: 0 }}
                  title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" component="h3">
                        {feedback.title}
                      </Typography>
                      <LaunchIcon fontSize="small" />
                    </Stack>
                  }
                  subheader={
                    <Typography
                      variant="caption"
                      component="p"
                      style={{ color: "grey" }}
                    >
                      {feedback.description}
                    </Typography>
                  }
                />
              </Card>
            </Link>
          </CardActionArea>
        );
      })}
    </Stack>
  );
};

export default Feedback;
