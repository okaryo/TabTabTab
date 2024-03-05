import { useDroppable } from "@dnd-kit/core";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { useContext, useState } from "react";
import t from "../../../../../i18n/Translations";
import { Window, flatTabsInWindow } from "../../../../../model/Window";
import { addWindow } from "../../../../../repository/WindowsRepository";
import { WindowActionMenu } from "../../../../components/ActionMenu";
import DragAndDropContext, {
  DROPPABLE_EMPTY_WINDOW_COLUMN_ID,
  DROPPABLE_WINDOW_COLUMN_ID_PREFIX,
} from "../../../../components/DragAndDropContext";
import TabList from "../../../../components/TabList";
import { WindowsContext } from "../../../../contexts/WindowsContext";

type WindowColumnProps = {
  windows: Window[];
  index: number;
};
type TabListProps = {
  window: Window;
  index: number;
};

const WindowColumn = (props: WindowColumnProps) => {
  const { windows, index } = props;
  const window = windows[index];

  const [menuAnchorElement, setMenuAnchorElement] =
    useState<HTMLElement | null>(null);
  const onClickWindowActionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const onCloseMenu = () => setMenuAnchorElement(null);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        width: 420,
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, py: 1 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">
            {index === 0 ? t.currentWindow : `${t.window}${index}`}
          </Typography>
          <Chip
            label={flatTabsInWindow(window).length}
            size="small"
            color="primary"
          />
        </Stack>
        <IconButton onClick={onClickWindowActionMenu}>
          <MoreVertIcon />
        </IconButton>
      </Stack>
      <WindowActionMenu
        windows={windows}
        currentIndex={index}
        isOpenMenu={Boolean(menuAnchorElement)}
        anchorElement={menuAnchorElement}
        onCloseMenu={onCloseMenu}
      />
      <Divider />
      <DroppableTabList window={window} index={index} />
    </Paper>
  );
};

const DroppableTabList = (props: TabListProps) => {
  const { window, index } = props;

  const { setNodeRef } = useDroppable({
    id: `${DROPPABLE_WINDOW_COLUMN_ID_PREFIX}${window.id}`,
  });

  return (
    <Box ref={setNodeRef} sx={{ flexGrow: 1, overflowY: "auto" }}>
      <TabList key={window.id} selectedWindowIndex={index} />
    </Box>
  );
};

const DroppableEmptyWindowColumn = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: DROPPABLE_EMPTY_WINDOW_COLUMN_ID,
  });

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      raised={true}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        width: 420,
        overflow: "hidden",
        borderStyle: isOver ? "solid" : "dashed",
        backgroundColor: isOver ? blue[100] : "background.paper",
      }}
    >
      <CardActionArea
        sx={{ height: "100%", width: "100%", textAlign: "center" }}
        onClick={addWindow}
      >
        <Typography variant="subtitle1" sx={{ color: "text.disabled" }}>
          {t.addWindow}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const Overview = () => {
  const { windows } = useContext(WindowsContext);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p: 2,
        overflowY: "hidden",
        height: "calc(100vh - 64px)",
      }}
    >
      <DragAndDropContext>
        {windows.map((window, index) => (
          <WindowColumn key={window.id} windows={windows} index={index} />
        ))}
        <DroppableEmptyWindowColumn />
      </DragAndDropContext>
    </Stack>
  );
};

export default Overview;
