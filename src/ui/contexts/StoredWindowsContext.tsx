import { createContext, useEffect, useState } from "react";
import { type AsyncState, initialState } from "../../model/AsyncState";
import type { StoredWindow } from "../../model/Window";
import {
  addListenerOnChangeStoredWindows,
  getStoredWindows,
  removeListenerOnChangeStoredWindows,
} from "../../platform/repository/WindowsRepository";
import useAsync from "../hooks/useAsync";

export const StoredWindowsContext =
  createContext<AsyncState<StoredWindow[]>>(initialState);

export const StoredWindowsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const asyncState = useAsync<StoredWindow[]>(async () => {
    const storedWindows = await getStoredWindows();
    return storedWindows;
  }, []);
  const [state, setState] = useState(asyncState);

  useEffect(() => {
    setState(asyncState);
  }, [asyncState]);

  useEffect(() => {
    const listenerOnChange = addListenerOnChangeStoredWindows(
      (newValue: StoredWindow[]) =>
        setState({ loading: false, value: newValue, error: null }),
    );

    return () => removeListenerOnChangeStoredWindows(listenerOnChange);
  }, []);

  return (
    <StoredWindowsContext.Provider value={state}>
      {children}
    </StoredWindowsContext.Provider>
  );
};
