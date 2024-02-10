import { StoredTabGroupsContext } from "../contexts/StoredTabGroupsContext";
import { useStoredTabGroups } from "../hooks/useStoredTabGroups";

const StoredTabGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <StoredTabGroupsContext.Provider value={useStoredTabGroups()}>
      {children}
    </StoredTabGroupsContext.Provider>
  );
};

export default StoredTabGroupsProvider;
