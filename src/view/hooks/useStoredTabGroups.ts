import { useEffect, useState } from "react";

import { getStoredTabGroups } from "../../repository/TabGroupRepository";

export const useStoredTabGroups = () => {
  const [storedTabGroups, setStoredTabGroups] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedTabGroups = await getStoredTabGroups();
      setStoredTabGroups(storedTabGroups);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initState();
  }, []);

  return {
    storedTabGroups,
    setStoredTabGroups,
  };
};
