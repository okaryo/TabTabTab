import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { Dispatch, useContext, useEffect } from "react";

import t from "../../../../i18n/Translations";
import { flatTabsInWindow } from "../../../../model/Window";
import { WindowsContext } from "../contexts/Windows";

import WindowTab from "./WindowTab";

type WindowTabsProps = {
  selectedIndex: number;
  onSelectIndex: Dispatch<React.SetStateAction<number>>;
};

const WindowTabs = (props: WindowTabsProps) => {
  const { selectedIndex, onSelectIndex } = props;
  const { windows } = useContext(WindowsContext);

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
        scrollButtons={false}
      >
        {windows.map((window, index) => (
          <WindowTab
            key={window.id}
            label={window.focused ? t.currentWindow : `${t.window}${index}`}
            tabCount={flatTabsInWindow(window).length}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default WindowTabs;
