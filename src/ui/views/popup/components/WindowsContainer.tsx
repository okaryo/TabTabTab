import { useContext, useEffect, useState } from "react";

import { WindowsContext } from "../../../contexts/WindowsContext";

import DragAndDropContext from "../../shared/components/DragAndDropContext";
import TabList from "../../shared/components/TabList";
import WindowTabs from "./WindowTabs";

const WindowsContainer = () => {
  const { windows } = useContext(WindowsContext);
  const [selectedWindowIndex, setSelectedWindowIndex] = useState(0);

  useEffect(() => {
    if (selectedWindowIndex >= windows.length) {
      setSelectedWindowIndex(0);
    }
  }, [windows.length, selectedWindowIndex]);

  return (
    <DragAndDropContext>
      <WindowTabs
        selectedIndex={selectedWindowIndex}
        onSelectIndex={setSelectedWindowIndex}
      />
      <TabList selectedWindowIndex={selectedWindowIndex} />
    </DragAndDropContext>
  );
};

export default WindowsContainer;
