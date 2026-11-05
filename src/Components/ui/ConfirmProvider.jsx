import { useCallback, useEffect, useRef, useState } from "react";
import { ConfirmContext } from "./confirmContext";

/** Promise-based confirmation dialog using the native <dialog> element (focus trap + Esc included). */
const ConfirmProvider = ({ children }) => {
  const ref = useRef(null);
  const resolver = useRef(null);
  const [opts, setOpts] = useState(null);

  const confirm = useCallback((options) => new Promise((resolve) => {
    resolver.current = resolve;
    setOpts(options);
  }), []);

  useEffect(() => {
    if (opts && ref.current && !ref.current.open) ref.current.showModal();
  }, [opts]);

  const close = (answer) => {
    ref.current?.close();
    resolver.current?.(answer);
    resolver.current = null;
    setOpts(null);
  };

  return (
    <ConfirmContext value={confirm}>
      {children}
      {opts && (
        <dialog ref={ref} onCancel={(e) => { e.preventDefault(); close(false); }}
          onClick={(e) => { if (e.target === ref.current) close(false); }}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface text-ink p-0 shadow-lg backdrop:bg-black/50">
          <div className="p-5 sm:p-6">
            <h2 className="text-xl">{opts.title}</h2>
            {opts.message && <p className="text-muted mt-2">{opts.message}</p>}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
              <button className="btn btn-outline" onClick={() => close(false)} autoFocus>{opts.cancelLabel || "Cancel"}</button>
              <button className={`btn ${opts.danger ? "btn-danger" : "btn-primary"}`} onClick={() => close(true)}>
                {opts.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </ConfirmContext>
  );
};

export default ConfirmProvider;
