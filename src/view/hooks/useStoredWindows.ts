import { useEffect, useState } from "react";

import { getStoredWindows } from "../../repository/WindowsRepository";

export const useStoredWindows = () => {
  const [storedWindows, setStoredWindows] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedWindows = await getStoredWindows();
      setStoredWindows(storedWindows);
    };
    initState();
  }, []);

  return {
    storedWindows,
    setStoredWindows,
  };
};
