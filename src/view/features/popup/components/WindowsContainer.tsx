import { useContext, useEffect, useState } from "react";

import DragAndDropContext from "../../../components/DragAndDropContext";
import TabList from "../../../components/TabList";
import { WindowsContext } from "../../../contexts/Windows";

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
