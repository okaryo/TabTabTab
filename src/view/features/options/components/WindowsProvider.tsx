import { WindowsContext } from "../../../contexts/Windows";
import { useWindows } from "../../../hooks/useWindows";

const WindowsProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WindowsContext.Provider value={useWindows()}>
      {children}
    </WindowsContext.Provider>
  );
};

export default WindowsProvider;
