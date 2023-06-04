import { createContext } from "react";
import { Windows } from "../../../model/Windows";

type WindowsContextType = {
  windows: Windows;
  setWindows: React.Dispatch<React.SetStateAction<Windows>>;
} | null;

const initialState = {
  windows: Windows.empty(),
  setWindows: () => {},
};

export const WindowsContext = createContext<WindowsContextType>(initialState);
