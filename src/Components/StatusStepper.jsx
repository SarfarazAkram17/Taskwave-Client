import { LuCheck, LuX } from "react-icons/lu";

const STEPS = [
  ["open", "Open"],
  ["in_progress", "In progress"],
  ["in_review", "In review"],
  ["completed", "Completed"],
];

/** Horizontal lifecycle indicator; collapses to a vertical list on very narrow screens. */
const StatusStepper = ({ status }) => {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-muted text-sm"><LuX size={16} /> This task was cancelled.</div>
    );
  }
  const current = STEPS.findIndex(([k]) => k === status);
  return (
    <ol className="grid grid-cols-1 xs:grid-cols-4 gap-3 xs:gap-2 list-none p-0 m-0" aria-label="Task progress">
      {STEPS.map(([key, label], i) => {
        const done = i < current || status === "completed";
        const now = i === current && status !== "completed";
        return (
          <li key={key} className="flex xs:flex-col gap-2.5 xs:gap-2" aria-current={now ? "step" : undefined}>
            <div className="flex items-center xs:w-full gap-2">
              <span className={`grid place-items-center w-7 h-7 rounded-full text-xs font-bold shrink-0 border-2 ${
                done ? "bg-success border-success text-white" : now ? "border-primary text-primary bg-primary-soft" : "border-line-strong text-faint"}`}
                style={done ? { color: "var(--on-primary)" } : undefined}>
                {done ? <LuCheck size={14} /> : i + 1}
              </span>
              <span className="hidden xs:block flex-1 h-0.5 rounded" style={{ background: i < current || status === "completed" ? "var(--success)" : "var(--line)", visibility: i === STEPS.length - 1 ? "hidden" : "visible" }} />
            </div>
            <span className={`text-sm leading-7 xs:leading-tight ${now ? "font-semibold" : done ? "text-muted" : "text-faint"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default StatusStepper;
