import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { useTheme } from "@mui/material/styles";
import { Dispatch, useContext, useEffect } from "react";

import t from "../../../../i18n/Translations";
import { flatTabsInWindow } from "../../../../model/Window";
import { WindowsContext } from "../../../contexts/WindowsContext";

import WindowTab from "./WindowTab";

type WindowTabsProps = {
  selectedIndex: number;
  onSelectIndex: Dispatch<React.SetStateAction<number>>;
};

const WindowTabs = (props: WindowTabsProps) => {
  const { selectedIndex, onSelectIndex } = props;
  const { windows } = useContext(WindowsContext);
  const theme = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        const maxWindowIndex = windows.length - 1;
        onSelectIndex((oldIndex) =>
          oldIndex === maxWindowIndex ? 0 : oldIndex + 1,
        );
      } else if (event.key === "ArrowLeft") {
        const minWindowIndex = 0;
        onSelectIndex((oldIndex) =>
          oldIndex === minWindowIndex ? windows.length - 1 : oldIndex - 1,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onSelectIndex, windows.length]);

  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    onSelectIndex(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={selectedIndex}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",

          "& .MuiTabScrollButton-horizontal": {
            position: "absolute",
            height: 28,
            width: 28,
            bgcolor: "background.paper",
            boxShadow: theme.shadows[4],
            borderRadius: "50%",
            border: `1px solid ${theme.palette.divider}`,
            opacity: 1,
            zIndex: 10,
          },
          "& .MuiTabScrollButton-horizontal:first-child": {
            left: 0,
            ml: 0.5,
          },
          "& .MuiTabScrollButton-horizontal:last-child": {
            right: 0,
            mr: 0.5,
          },
          "& .Mui-disabled": {
            opacity: 0,
          },
        }}
      >
        {windows.map((window, index) => (
          <WindowTab
            key={window.id}
            id={window.id}
            windows={windows}
            index={index}
            label={window.focused ? t.currentWindow : `${t.window}${index}`}
            tabCount={flatTabsInWindow(window).length}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default WindowTabs;
