import { createContext } from "react";

import { Windows } from "../../../model/Windows";

type WindowsContextType = {
  windows: Windows;
  setWindows: React.Dispatch<React.SetStateAction<Windows>>;
};

const initialState: WindowsContextType = {
  windows: Windows.empty(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setWindows: () => {},
};

export const WindowsContext = createContext<WindowsContextType>(initialState);
