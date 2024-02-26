import { useCallback, useEffect, useState } from "react";
import { Window } from "../../model/Window";
import {
  addListenerOnChangeTabs,
  removeListenerOnChangeTabs,
} from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";

export const useWindows = () => {
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

  return {
    windows,
    setWindows,
  };
};
