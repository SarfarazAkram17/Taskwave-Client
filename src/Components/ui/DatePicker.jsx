import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LuCalendarDays, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { formatDate } from "../../lib/format";

/* Dates are handled as "YYYY-MM-DD" strings in local time, so there are no timezone surprises. */
const pad = (n) => String(n).padStart(2, "0");
const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parse = (v) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v || "")) return null;
  const [y, m, d] = v.split("-").map(Number);
  return { y, m: m - 1, d };
};
const fromDate = (dt) => iso(dt.getFullYear(), dt.getMonth(), dt.getDate());
const shiftDays = (v, n) => {
  const p = parse(v);
  return fromDate(new Date(p.y, p.m, p.d + n));
};
const shiftMonths = (v, n) => {
  const p = parse(v);
  const last = new Date(p.y, p.m + n + 1, 0).getDate(); // keep the day inside shorter months
  return fromDate(new Date(p.y, p.m + n, Math.min(p.d, last)));
};
const todayISO = () => fromDate(new Date());
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabel = (y, m) =>
  new Date(y, m, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
const longLabel = (v) => {
  const p = parse(v);
  return new Date(p.y, p.m, p.d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Custom calendar field. Click the field to open the calendar.
 * value / onChange use "YYYY-MM-DD" strings; `min` and `max` disable days outside the range.
 * Keyboard: arrows move by day/week, PageUp/PageDown by month, Enter/Space selects, Esc closes.
 * Accepts id / aria-* props so it works inside <Field>.
 */
const DatePicker = ({
  value,
  onChange,
  min,
  max,
  placeholder = "Select a date",
  clearable = false,
  disabled = false,
  id,
  ...aria
}) => {
  const autoId = useId();
  const dialogId = `${autoId}-cal`;
  const wrap = useRef(null);
  const trigger = useRef(null);
  const grid = useRef(null);
  const [open, setOpen] = useState(false);
  const [up, setUp] = useState(false);
  const [focusDate, setFocusDate] = useState(todayISO());
  const [view, setView] = useState(() => {
    const p = parse(value) || parse(todayISO());
    return { y: p.y, m: p.m };
  });
  const today = todayISO();

  const inRange = useCallback(
    (v) => (!min || v >= min) && (!max || v <= max),
    [min, max],
  );
  const clamp = useCallback(
    (v) => (min && v < min ? min : max && v > max ? max : v),
    [min, max],
  );

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }, []);

  const openCalendar = () => {
    if (disabled) return;
    const start = clamp(parse(value) ? value : today);
    const p = parse(start);
    setFocusDate(start);
    setView({ y: p.y, m: p.m });
    // Open upwards on large screens when there isn't enough room below the field.
    const r = trigger.current?.getBoundingClientRect();
    setUp(
      !!r &&
        window.innerHeight - r.bottom < 380 &&
        r.top > window.innerHeight - r.bottom,
    );
    setOpen(true);
  };

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  // Move DOM focus to the active day whenever it changes (roving tabindex).
  useLayoutEffect(() => {
    if (open)
      grid.current
        ?.querySelector(`[data-date="${focusDate}"]`)
        ?.focus({ preventScroll: true });
  }, [open, focusDate, view]);

  const moveTo = (next) => {
    const v = clamp(next);
    const p = parse(v);
    setFocusDate(v);
    setView({ y: p.y, m: p.m });
  };

  const onGridKey = (e) => {
    const map = {
      ArrowLeft: () => shiftDays(focusDate, -1),
      ArrowRight: () => shiftDays(focusDate, 1),
      ArrowUp: () => shiftDays(focusDate, -7),
      ArrowDown: () => shiftDays(focusDate, 7),
      PageUp: () => shiftMonths(focusDate, -1),
      PageDown: () => shiftMonths(focusDate, 1),
    };
    if (e.key === "Home") {
      e.preventDefault();
      const p = parse(focusDate);
      return moveTo(iso(p.y, p.m, 1));
    }
    if (e.key === "End") {
      e.preventDefault();
      const p = parse(focusDate);
      return moveTo(iso(p.y, p.m, new Date(p.y, p.m + 1, 0).getDate()));
    }
    if (map[e.key]) {
      e.preventDefault();
      moveTo(map[e.key]());
    }
  };

  const onPanelKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  const pick = (v) => {
    onChange(v);
    close();
  };

  const changeMonth = (n) => {
    const next = shiftMonths(iso(view.y, view.m, 1), n);
    const p = parse(next);
    setView({ y: p.y, m: p.m });
    setFocusDate(
      clamp(
        iso(
          p.y,
          p.m,
          Math.min(parse(focusDate).d, new Date(p.y, p.m + 1, 0).getDate()),
        ),
      ),
    );
  };

  const cells = useMemo(() => {
    const lead = new Date(view.y, view.m, 1).getDay();
    const count = new Date(view.y, view.m + 1, 0).getDate();
    return [
      ...Array(lead).fill(null),
      ...Array.from({ length: count }, (_, i) => iso(view.y, view.m, i + 1)),
    ];
  }, [view]);

  const prevDisabled = !!min && fromDate(new Date(view.y, view.m, 0)) < min; // last day of previous month
  const nextDisabled = !!max && fromDate(new Date(view.y, view.m + 1, 1)) > max; // first day of next month

  return (
    <div className="relative" ref={wrap} onKeyDown={onPanelKey}>
      <button
        type="button"
        id={id}
        ref={trigger}
        onClick={() => (open ? close(false) : openCalendar())}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        {...aria}
        className="input flex items-center justify-between gap-3 text-left"
      >
        <span className={`truncate ${value ? "" : "text-faint"}`}>
          {value ? formatDate(value) : placeholder}
        </span>
        <LuCalendarDays
          size={18}
          className="text-muted shrink-0"
          aria-hidden="true"
        />
      </button>

      {open && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-[60] bg-black/50"
            aria-hidden="true"
            onClick={() => close()}
          />
          <div
            id={dialogId}
            role="dialog"
            aria-label="Choose a date"
            className={`card z-[70] p-3 shadow-lg pop-in fixed left-1/2 -translate-x-1/2 bottom-4 w-[min(20rem,calc(100vw-2rem))] sm:absolute sm:left-0 sm:translate-x-0 sm:bottom-auto ${up ? "sm:bottom-full sm:mb-2" : "sm:top-full sm:mt-2"}`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                disabled={prevDisabled}
              >
                <LuChevronLeft size={18} />
              </button>
              <p className="font-display font-semibold" aria-live="polite">
                {monthLabel(view.y, view.m)}
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                disabled={nextDisabled}
              >
                <LuChevronRight size={18} />
              </button>
            </div>
            <div
              role="grid"
              aria-label={monthLabel(view.y, view.m)}
              ref={grid}
              onKeyDown={onGridKey}
            >
              <div role="row" className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((d) => (
                  <span
                    key={d}
                    role="columnheader"
                    className="text-center text-xs font-semibold text-muted py-1"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((v, i) => {
                  if (!v)
                    return (
                      <span key={`b${i}`} role="gridcell" aria-hidden="true" />
                    );
                  const selected = v === value,
                    isToday = v === today,
                    ok = inRange(v),
                    active = v === focusDate;
                  return (
                    <button
                      key={v}
                      type="button"
                      role="gridcell"
                      data-date={v}
                      disabled={!ok}
                      tabIndex={active ? 0 : -1}
                      aria-selected={selected}
                      aria-current={isToday ? "date" : undefined}
                      aria-label={longLabel(v)}
                      onClick={() => pick(v)}
                      className={`h-9 rounded-lg text-sm tabular-nums transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${
                        selected
                          ? "bg-primary text-on-primary font-semibold"
                          : isToday
                            ? "border border-primary text-primary font-semibold hover:bg-primary-soft"
                            : "hover:bg-surface-2"
                      }`}
                    >
                      {Number(v.slice(8))}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-line">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={!inRange(today)}
                onClick={() => pick(today)}
              >
                Today
              </button>
              {clearable && value ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => pick("")}
                >
                  Clear
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => close()}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;