import { useEffect, useState } from "react";
import type { AsyncState } from "../../model/AsyncState";

const useAsync = <T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = [],
): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    value: null,
    error: null,
  });

  useEffect(() => {
    const execute = async () => {
      setState({ loading: true, value: null, error: null });

      try {
        const result = await fn();
        setState({ loading: false, value: result, error: null });
      } catch (error: unknown) {
        setState({
          loading: false,
          value: null,
          error: error instanceof Error ? error : new Error("Unknown error"),
        });
      }
    };

    execute();
  }, [fn, ...deps]);

  return state;
};

export default useAsync;
