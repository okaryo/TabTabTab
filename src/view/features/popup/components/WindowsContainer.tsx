import { useContext, useEffect, useState } from "react";

import { WindowsContext } from "../contexts/Windows";

import TabList from "./TabList";
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
    <>
      <WindowTabs
        selectedIndex={selectedWindowIndex}
        onSelectIndex={setSelectedWindowIndex}
      />
      <TabList selectedWindowIndex={selectedWindowIndex} />
    </>
  );
};

export default WindowsContainer;
