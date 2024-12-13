export type AsyncState<T> = {
  loading: boolean;
  value: T | null;
  error: Error | null;
};

export const initialState = {
  loading: false,
  value: null,
  error: null,
};

export const isLoading = <T>(state: AsyncState<T>) => {
  return state.loading || state.value === null;
};
