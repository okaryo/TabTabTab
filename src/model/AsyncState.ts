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
