import { createContext } from "react";

import { StoredWindow } from "../../model/Window";

type StoredWindowsContextType = {
  storedWindows: StoredWindow[];
  setStoredWindows: React.Dispatch<React.SetStateAction<StoredWindow[]>>;
};

export const StoredWindowsContext = createContext<StoredWindowsContextType>({
  storedWindows: [],
  setStoredWindows: () => {},
});
