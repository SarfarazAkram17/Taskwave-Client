import { useCallback, useEffect, useRef, useState } from "react";

/** Runs an async loader, exposing { data, error, loading, reload, setData }. */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const alive = useRef(0);

  const run = useCallback(() => {
    const id = ++alive.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    return Promise.resolve()
      .then(loader)
      .then((data) => id === alive.current && setState({ data, error: null, loading: false }))
      .catch((error) => id === alive.current && setState((s) => ({ ...s, error, loading: false })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    const ref = alive;
    return () => { ref.current++; };
  }, [run]);

  const setData = useCallback((updater) => {
    setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater }));
  }, []);

  return { ...state, reload: run, setData };
}

export function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
