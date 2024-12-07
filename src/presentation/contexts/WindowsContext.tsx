import { createContext, useCallback, useEffect, useState } from "react";
import {
  addListenerOnChangeTabs,
  removeListenerOnChangeTabs,
} from "../../data/repository/TabsRepository";
import { getWindows } from "../../data/repository/WindowsRepository";
import type { Window } from "../../model/Window";

type WindowsContextType = {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
};

export const WindowsContext = createContext<WindowsContextType>({
  windows: [],
  setWindows: () => {},
});

export const WindowsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [windows, setState] = useState([]);

  const setWindows = useCallback((windows: Window[]) => {
    const sortedWindows = [...windows].sort(
      (a, b) => (b.focused ? 1 : 0) - (a.focused ? 1 : 0),
    );
    setState(sortedWindows);
  }, []);

  useEffect(() => {
    const initState = async () => {
      const windows = await getWindows();
      setWindows(windows);
    };
    initState();

    const listenerOnChangeTabs = addListenerOnChangeTabs(async () => {
      const windows = await getWindows();
      setWindows(windows);
    });

    return () => removeListenerOnChangeTabs(listenerOnChangeTabs);
  }, [setWindows]);

  return (
    <WindowsContext.Provider value={{ windows, setWindows }}>
      {children}
    </WindowsContext.Provider>
  );
};
