import { createContext, useEffect, useState } from "react";
import {
  addListenerOnChangeStoredWindows,
  getStoredWindows,
  removeListenerOnChangeStoredWindows,
} from "../../data/repository/WindowsRepository";
import { StoredWindow } from "../../model/Window";

type StoredWindowsContextType = {
  storedWindows: StoredWindow[];
};

export const StoredWindowsContext = createContext<StoredWindowsContextType>({
  storedWindows: [],
});

export const StoredWindowsProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [storedWindows, setStoredWindows] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedWindows = await getStoredWindows();
      setStoredWindows(storedWindows);
    };
    initState();

    const listenerOnChange = addListenerOnChangeStoredWindows(
      (newValue: StoredWindow[]) => setStoredWindows(newValue),
    );

    return () => removeListenerOnChangeStoredWindows(listenerOnChange);
  }, []);

  return (
    <StoredWindowsContext.Provider value={{ storedWindows }}>
      {children}
    </StoredWindowsContext.Provider>
  );
};
