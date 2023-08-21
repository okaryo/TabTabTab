import { useCallback, useEffect, useState } from "react";

import { Window } from "../../../../model/Window";
import { getWindows } from "../../../../repository/WindowsRepository";

export const useWindows = () => {
  const [windows, setState] = useState([]);

  useEffect(() => {
    const initState = async () => {
      setState(await getWindows());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const setWindows = useCallback((windows: Window[]) => {
    setState(windows);
  }, []);

  return {
    windows,
    setWindows,
  };
};
