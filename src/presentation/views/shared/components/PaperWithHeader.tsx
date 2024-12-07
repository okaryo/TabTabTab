import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";

type PaperWithHeaderProps = {
  header: string;
  children: React.ReactNode;
};

const PaperWithHeader = (props: PaperWithHeaderProps) => {
  const { header, children } = props;

  return (
    <Paper variant="outlined">
      <ListItem
        sx={[
          {
            backgroundColor: grey[100],
          },
          (theme) =>
            theme.applyStyles("dark", {
              backgroundColor: alpha(grey[800], 0.4),
            }),
        ]}
      >
        <ListItemText
          primary={<Typography variant="subtitle1">{header}</Typography>}
        />
      </ListItem>
      <Divider />
      {children}
    </Paper>
  );
};

export default PaperWithHeader;
