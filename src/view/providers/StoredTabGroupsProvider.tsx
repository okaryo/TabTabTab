import { StoredTabGroupsContext } from "../contexts/StoredTabGroups";
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
