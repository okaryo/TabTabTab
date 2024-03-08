import { createContext, useEffect, useState } from "react";
import { getStoredWindows } from "../../data/repository/WindowsRepository";
import { StoredWindow } from "../../model/Window";

type StoredWindowsContextType = {
  storedWindows: StoredWindow[];
  setStoredWindows: React.Dispatch<React.SetStateAction<StoredWindow[]>>;
};

export const StoredWindowsContext = createContext<StoredWindowsContextType>({
  storedWindows: [],
  setStoredWindows: () => {},
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
  }, []);

  return (
    <StoredWindowsContext.Provider value={{ storedWindows, setStoredWindows }}>
      {children}
    </StoredWindowsContext.Provider>
  );
};
