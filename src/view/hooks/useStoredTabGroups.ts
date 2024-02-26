import { useEffect, useState } from "react";

import { getStoredTabGroups } from "../../repository/TabGroupRepository";

export const useStoredTabGroups = () => {
  const [storedTabGroups, setStoredTabGroups] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedTabGroups = await getStoredTabGroups();
      setStoredTabGroups(storedTabGroups);
    };
    initState();
  }, []);

  return {
    storedTabGroups,
    setStoredTabGroups,
  };
};
