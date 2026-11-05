import { Link } from "react-router";
import { LuCalendarClock, LuMessagesSquare } from "react-icons/lu";
import { CATEGORIES } from "../lib/constants";
import { deadlineInfo, money } from "../lib/format";
import { StatusBadge } from "./ui/StatusBadge";
import Avatar from "./ui/Avatar";

const TONE = { muted: "text-muted", warning: "text-warning", danger: "text-danger" };

const TaskCard = ({ task, to = `/tasks/${task._id}` }) => {
  const cat = CATEGORIES.find((c) => c.name === task.category);
  const Icon = cat?.icon;
  const due = deadlineInfo(task.deadline);
  return (
    <Link to={to} className="card card-hover card-pad flex flex-col gap-3 h-full min-w-0 group">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted min-w-0">
          {Icon && <Icon size={14} aria-hidden="true" className="shrink-0" />}
          <span className="truncate">{task.category}</span>
        </span>
        {task.status && task.status !== "open" && <StatusBadge status={task.status} />}
      </div>
      <h3 className="text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">{task.title}</h3>
      <p className="text-muted line-clamp-2 flex-1">{task.description}</p>
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-line">
        <p className="font-display text-xl font-bold tabular-nums">{money(task.budget)}</p>
        <div className="flex items-center gap-3 text-xs text-right">
          <span className={`inline-flex items-center gap-1 ${TONE[due.tone]}`}><LuCalendarClock size={14} aria-hidden="true" />{due.text}</span>
          <span className="inline-flex items-center gap-1 text-muted" title="Proposals"><LuMessagesSquare size={14} aria-hidden="true" />{task.proposals ?? 0}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted min-w-0">
        <Avatar name={task.name} src={task.ownerPhoto} size={20} />
        <span className="truncate">{task.name}</span>
      </div>
    </Link>
  );
};

export default TaskCard;
