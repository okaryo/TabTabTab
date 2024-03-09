import { createContext, useEffect, useState } from "react";
import {
  addListenerOnChangeStoredTabGroups,
  getStoredTabGroups,
  removeListenerOnChangeStoredTabGroups,
} from "../../data/repository/TabGroupRepository";
import { StoredTabGroup } from "../../model/TabContainer";

type StoredTabGroupsContextType = {
  storedTabGroups: StoredTabGroup[];
};

export const StoredTabGroupsContext = createContext<StoredTabGroupsContextType>(
  {
    storedTabGroups: [],
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

    const listenerOnChange = addListenerOnChangeStoredTabGroups(
      (newValue: StoredTabGroup[]) => setStoredTabGroups(newValue),
    );

    return () => removeListenerOnChangeStoredTabGroups(listenerOnChange);
  }, []);

  return (
    <StoredTabGroupsContext.Provider value={{ storedTabGroups }}>
      {children}
    </StoredTabGroupsContext.Provider>
  );
};
