import { useId } from "react";

/** Label + control + hint/error wired together for screen readers. Child receives id/aria props. */
const Field = ({ label, hint, error, children, className = "", optional }) => {
  const id = useId();
  const describedBy = error ? `${id}-e` : hint ? `${id}-h` : undefined;
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        {optional && <span className="text-faint font-normal"> (optional)</span>}
      </label>
      {children({ id, "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}
      {error ? <p id={`${id}-e`} className="field-error">{error}</p> : hint ? <p id={`${id}-h`} className="hint">{hint}</p> : null}
    </div>
  );
};

export default Field;
