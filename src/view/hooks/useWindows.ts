import { useCallback, useEffect, useState } from "react";

import { Window } from "../../model/Window";
import {
  addListenerOnUpdateTabs,
  removeListenerOnUpdateTabs,
} from "../../repository/TabsRepository";
import { getWindows } from "../../repository/WindowsRepository";

export const useWindows = () => {
  const [windows, setState] = useState([]);

  const sortByFocused = (windows: Window[]): Window[] => {
    return [...windows].sort(
      (a, b) => (b.focused ? 1 : 0) - (a.focused ? 1 : 0),
    );
  };
  const setWindows = useCallback(
    (windows: Window[]) => {
      const sortedWindows = sortByFocused(windows);
      setState(sortedWindows);
    },
    [sortByFocused],
  );

  useEffect(() => {
    const initState = async () => {
      const windows = await getWindows();
      setWindows(windows);
    };
    initState();

    const listenerOnUpdateTabs = addListenerOnUpdateTabs(async () => {
      const windows = await getWindows();
      setWindows(windows);
    });

    return () => removeListenerOnUpdateTabs(listenerOnUpdateTabs);
  }, [setWindows]);

  return {
    windows,
    setWindows,
  };
};
