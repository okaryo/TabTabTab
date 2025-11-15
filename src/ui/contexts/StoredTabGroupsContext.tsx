import { createContext, useEffect, useState } from "react";
import {
  addListenerOnChangeStoredTabGroups,
  getStoredTabGroups,
  removeListenerOnChangeStoredTabGroups,
} from "../../data/repository/TabGroupRepository";
import { type AsyncState, initialState } from "../../model/AsyncState";
import type { StoredTabGroup } from "../../model/TabContainer";
import useAsync from "../hooks/useAsync";

export const StoredTabGroupsContext =
  createContext<AsyncState<StoredTabGroup[]>>(initialState);

export const StoredTabGroupsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const asyncState = useAsync<StoredTabGroup[]>(async () => {
    const storedTabGroups = await getStoredTabGroups();
    return storedTabGroups;
  }, []);
  const [state, setState] = useState(asyncState);

  useEffect(() => {
    setState(asyncState);
  }, [asyncState]);

  useEffect(() => {
    const listenerOnChange = addListenerOnChangeStoredTabGroups(
      (newValue: StoredTabGroup[]) =>
        setState({ loading: false, value: newValue, error: null }),
    );

    return () => removeListenerOnChangeStoredTabGroups(listenerOnChange);
  }, []);

  return (
    <StoredTabGroupsContext.Provider value={state}>
      {children}
    </StoredTabGroupsContext.Provider>
  );
};
