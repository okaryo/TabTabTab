import { createContext } from "react";

import { Window } from "../../model/Window";

type WindowsContextType = {
  windows: Window[];
  setWindows: React.Dispatch<React.SetStateAction<Window[]>>;
};

export const WindowsContext = createContext<WindowsContextType>({
  windows: [],
  setWindows: () => {},
});
