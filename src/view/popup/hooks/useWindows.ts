import { useCallback, useEffect, useState } from "react";
import { Windows } from "../../../model/Windows";
import { getWindows } from "../../../repository/WindowsRepository";

export const useWindows = () => {
  const [windows, setState] = useState(Windows.empty());

  useEffect(() => {
    const initState = async () => {
      setWindows(await getWindows());
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  const setWindows = useCallback((windows: Windows) => {
    setState(windows);
  }, []);

  console.log("+++++++++++++++++++");
  console.log(windows);
  console.log("+++++++++++++++++++");

  return {
    windows,
    setWindows,
  };
};
