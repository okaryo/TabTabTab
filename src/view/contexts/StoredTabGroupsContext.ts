import { createContext } from "react";

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
