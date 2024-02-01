import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

import t from "../../../i18n/Translations";
import { flatTabsInWindow } from "../../../model/Window";
import DragAndDropContext from "../../components/DragAndDropContext";
import { WindowsContext } from "../../contexts/Windows";
import TabList from "../popup/components/TabList";

const Overview = () => {
  const { windows } = useContext(WindowsContext);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p: 2,
        overflowY: "hidden",
      }}
    >
      <DragAndDropContext>
        {windows.map((window, index) => (
          <Paper variant="outlined" sx={{ width: 420, flexGrow: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ p: 2 }}
            >
              <Typography variant="h6">
                {index === 0 ? t.currentWindow : `${t.window}${index}`}
              </Typography>
              <Chip
                label={flatTabsInWindow(window).length}
                size="small"
                color="info"
              />
            </Stack>
            <Divider />
            <TabList key={window.id} selectedWindowIndex={index} />
          </Paper>
        ))}
      </DragAndDropContext>
    </Stack>
  );
};

export default Overview;
