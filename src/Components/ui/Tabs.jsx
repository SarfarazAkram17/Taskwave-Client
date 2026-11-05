/** Horizontally scrollable filter pills with optional counts. */
const Tabs = ({ tabs, value, onChange, label = "Filter" }) => (
  <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1" role="tablist" aria-label={label}>
    <div className="flex gap-1.5 w-max sm:w-auto sm:flex-wrap">
      {tabs.map((t) => {
        const on = t.value === value;
        return (
          <button key={t.value} role="tab" aria-selected={on} onClick={() => onChange(t.value)}
            className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`}>
            {t.label}
            {t.count !== undefined && <span className={`text-xs tabular-nums ${on ? "opacity-85" : "text-faint"}`}>{t.count}</span>}
          </button>
        );
      })}
    </div>
  </div>
);

export default Tabs;
