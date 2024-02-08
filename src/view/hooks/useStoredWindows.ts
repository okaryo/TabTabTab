import { useEffect, useState } from "react";

import { getStoredWindows } from "../../repository/WindowsRepository";

export const useStoredWindows = () => {
  const [storedWindows, setStoredWindows] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedWindows = await getStoredWindows();
      setStoredWindows(storedWindows);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  return {
    storedWindows,
    setStoredWindows,
  };
};
