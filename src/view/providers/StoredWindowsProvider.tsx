import { StoredWindowsContext } from "../contexts/StoredWindows";
import { useStoredWindows } from "../hooks/useStoredWindows";

const StoredWindowsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoredWindowsContext.Provider value={useStoredWindows()}>
      {children}
    </StoredWindowsContext.Provider>
  );
};

export default StoredWindowsProvider;
