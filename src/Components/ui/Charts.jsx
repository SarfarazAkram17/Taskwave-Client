import { useState } from "react";
import { STATUS } from "../../lib/constants";

/** Column chart built with HTML so labels stay crisp and wrap well down to 320px. */
export const BarChart = ({ data = [], label, format = (v) => v }) => {
  const [active, setActive] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((a, d) => a + d.value, 0);
  const summary = `${label}: ${data.map((d) => `${d.month} ${format(d.value)}`).join(", ")}`;

  return (
    <figure className="m-0">
      <div className="relative" role="img" aria-label={summary}>
        <div className="absolute inset-x-0 top-0 h-36 sm:h-44 pointer-events-none" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="absolute inset-x-0 border-t" style={{ top: `${(i / 3) * 100}%`, borderColor: "var(--chart-grid)" }} />
          ))}
        </div>
        <div className="relative flex items-end gap-1.5 sm:gap-3 h-36 sm:h-44">
          {data.map((d, i) => {
            const h = d.value ? Math.max(4, (d.value / max) * 100) : 0;
            return (
              <div key={d.key || d.month} className="flex-1 min-w-0 h-full flex items-end justify-center relative"
                onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
                {active === i && (
                  <div className="absolute z-10 -top-1 left-1/2 -translate-x-1/2 -translate-y-full card !rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md pointer-events-none">
                    <span className="text-muted">{d.month}</span> <strong className="tabular-nums">{format(d.value)}</strong>
                  </div>
                )}
                <button type="button" aria-label={`${d.month}: ${format(d.value)}`}
                  onFocus={() => setActive(i)} onBlur={() => setActive(null)}
                  className="w-full max-w-9 p-0 border-0 outline-offset-2"
                  style={{ height: `${h}%`, background: "var(--chart-1)", borderRadius: "4px 4px 0 0", opacity: active === null || active === i ? 1 : 0.55, minHeight: d.value ? 4 : 0, transition: "opacity .15s" }} />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 sm:gap-3 mt-2">
          {data.map((d) => (
            <span key={d.key || d.month} className="flex-1 min-w-0 text-center text-[0.6875rem] sm:text-xs text-muted">{d.month}</span>
          ))}
        </div>
      </div>
      <figcaption className="sr-only">{label}, total {format(total)}</figcaption>
    </figure>
  );
};

/** Single stacked bar + legend for status distribution. Text stays in ink; the swatch carries colour. */
export const StatusBar = ({ counts = {}, order = ["open", "in_progress", "in_review", "completed", "cancelled"] }) => {
  const items = order.map((k) => ({ key: k, n: counts[k] || 0 })).filter((x) => x.n > 0);
  const total = items.reduce((a, x) => a + x.n, 0);
  if (!total) return <p className="text-muted text-sm">No tasks yet.</p>;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 bg-surface-2" role="img"
        aria-label={items.map((x) => `${STATUS[x.key].label} ${x.n}`).join(", ")}>
        {items.map((x) => (
          <span key={x.key} style={{ width: `${(x.n / total) * 100}%`, background: STATUS[x.key].color }} title={`${STATUS[x.key].label}: ${x.n}`} />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 xs:grid-cols-2 gap-x-6 gap-y-2 list-none p-0 m-0">
        {order.map((k) => (
          <li key={k} className="flex items-center gap-2 text-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: STATUS[k].color }} />
            <span className="text-muted truncate">{STATUS[k].label}</span>
            <strong className="ml-auto tabular-nums">{counts[k] || 0}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};
