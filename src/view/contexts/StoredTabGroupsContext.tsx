import { createContext, useEffect, useState } from "react";
import { getStoredTabGroups } from "../../data/repository/TabGroupRepository";
import { StoredTabGroup } from "../../model/TabContainer";

type StoredTabGroupsContextType = {
  storedTabGroups: StoredTabGroup[];
  setStoredTabGroups: React.Dispatch<React.SetStateAction<StoredTabGroup[]>>;
};

export const StoredTabGroupsContext = createContext<StoredTabGroupsContextType>(
  {
    storedTabGroups: [],
    setStoredTabGroups: () => {},
  },
);

export const StoredTabGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [storedTabGroups, setStoredTabGroups] = useState([]);

  useEffect(() => {
    const initState = async () => {
      const storedTabGroups = await getStoredTabGroups();
      setStoredTabGroups(storedTabGroups);
    };
    initState();
  }, []);

  return (
    <StoredTabGroupsContext.Provider
      value={{ storedTabGroups, setStoredTabGroups }}
    >
      {children}
    </StoredTabGroupsContext.Provider>
  );
};
