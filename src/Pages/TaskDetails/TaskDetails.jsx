import { Link, useParams } from "react-router";
import { LuArrowLeft, LuCalendarClock, LuClock, LuMessagesSquare, LuWallet, LuLock, LuUserRound } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { useAuth } from "../../Authentication/useAuth";
import { useConfirm } from "../../Components/ui/confirmContext";
import { deadlineInfo, formatDate, money, timeAgo } from "../../lib/format";
import { BidBadge, StatusBadge } from "../../Components/ui/StatusBadge";
import { ErrorState, PageLoader } from "../../Components/ui/Feedback";
import Avatar from "../../Components/ui/Avatar";
import ProposalForm from "../../Components/ProposalForm";

const Meta = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3 min-w-0">
    <span className="grid place-items-center w-9 h-9 rounded-lg bg-surface-2 text-muted shrink-0"><Icon size={17} aria-hidden="true" /></span>
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold">{children}</p>
    </div>
  </div>
);

const ActionPanel = ({ task, reload }) => {
  const { user, role } = useAuth();
  const confirm = useConfirm();
  const myBid = task.myBid;

  if (!user) {
    return (
      <div className="space-y-3">
        <p className="text-muted">Log in or create a free account to send a proposal for this task.</p>
        <Link to="/login" state={{ from: `/tasks/${task._id}` }} className="btn btn-primary btn-block">Log in to send a proposal</Link>
        <Link to="/register" className="btn btn-outline btn-block">Create account</Link>
      </div>
    );
  }
  if (task.isOwner || role === "admin") {
    return (
      <div className="space-y-3">
        <p className="text-muted">{task.isOwner ? "This is your task." : "You're viewing this task as an admin."}</p>
        <Link to={`/dashboard/tasks/${task._id}`} className="btn btn-primary btn-block">{task.isOwner ? "Manage task and proposals" : "Open in dashboard"}</Link>
      </div>
    );
  }
  if (task.isAssignee) {
    return (
      <div className="space-y-3">
        <p className="text-muted">You were selected for this task.</p>
        <Link to={`/dashboard/tasks/${task._id}`} className="btn btn-primary btn-block">Open workspace</Link>
      </div>
    );
  }
  if (role === "client") {
    return <p className="text-muted">You're signed in as a client. Only freelancer accounts can send proposals.</p>;
  }
  if (myBid && myBid.status !== "withdrawn") {
    const withdraw = async () => {
      if (!(await confirm({ title: "Withdraw your proposal?", message: "You can send a new proposal later if the task is still open.", confirmLabel: "Withdraw", danger: true }))) return;
      try { await api.delete(`/bids/${myBid._id}`); toast.success("Proposal withdrawn"); reload(); }
      catch (e) { toast.error(e.message); }
    };
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2"><p className="font-semibold">Your proposal</p><BidBadge status={myBid.status} /></div>
        <p className="text-sm text-muted">{money(myBid.amount)} · {myBid.deliveryDays} days · sent {timeAgo(myBid.createdAt)}</p>
        <p className="prose-sm text-sm line-clamp-5">{myBid.message}</p>
        {myBid.status === "pending" && <button className="btn btn-danger btn-block" onClick={withdraw}>Withdraw proposal</button>}
        <Link to="/dashboard/proposals" className="btn btn-outline btn-block">View all my proposals</Link>
      </div>
    );
  }
  if (task.status !== "open") {
    return <p className="text-muted flex gap-2"><LuLock size={18} className="shrink-0 mt-0.5" />This task is no longer accepting proposals.</p>;
  }
  return <ProposalForm task={task} onSent={reload} />;
};

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: task, error, loading, reload } = useAsync(() => api.get(`/tasks/${id}`), [id, user?.uid]);

  if (loading && !task) return <PageLoader label="Loading task" />;
  if (error && !task) {
    return (
      <div className="page-container py-10">
        <div className="card"><ErrorState error={error.status === 404 ? { message: "This task doesn't exist or was removed." } : error} onRetry={error.status === 404 ? undefined : reload} /></div>
        <div className="text-center mt-6"><Link to="/tasks" className="btn btn-outline">Back to tasks</Link></div>
      </div>
    );
  }
  const due = deadlineInfo(task.deadline);

  return (
    <div className="page-container py-8 sm:py-12">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6"><LuArrowLeft size={16} />All tasks</Link>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-6 lg:gap-8 items-start">
        <article className="card card-pad !p-5 sm:!p-8 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="badge badge-plain">{task.category}</span>
            <StatusBadge status={task.status} />
          </div>
          <h1 className="text-2xl sm:text-4xl">{task.title}</h1>
          <p className="text-sm text-faint mt-2">Posted {timeAgo(task.createdAt)}</p>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-5 mt-7 py-6 border-y border-line">
            <Meta icon={LuWallet} label="Budget">{money(task.budget)}</Meta>
            <Meta icon={LuCalendarClock} label="Deadline">{formatDate(task.deadline)} <span className={`text-xs font-medium ${due.tone === "danger" ? "text-danger" : due.tone === "warning" ? "text-warning" : "text-muted"}`}>({due.text})</span></Meta>
            <Meta icon={LuMessagesSquare} label="Proposals">{task.proposals}</Meta>
            <Meta icon={LuClock} label="Status">{task.status === "open" ? "Accepting proposals" : "Closed to new proposals"}</Meta>
          </div>
          <h2 className="text-lg mt-7 mb-2">About this task</h2>
          <p className="prose-sm">{task.description}</p>
          <div className="mt-8 pt-6 border-t border-line flex items-center gap-3">
            <Avatar name={task.name} src={task.ownerPhoto} size={44} />
            <div className="min-w-0">
              <p className="text-xs text-muted flex items-center gap-1"><LuUserRound size={13} />Posted by</p>
              <p className="font-semibold truncate">{task.name}</p>
            </div>
          </div>
        </article>
        <aside className="card card-pad lg:sticky lg:top-24 min-w-0" aria-label="Send a proposal">
          <p className="text-sm text-muted">Task budget</p>
          <p className="font-display text-3xl font-bold mb-5">{money(task.budget)}</p>
          <ActionPanel task={task} reload={reload} />
        </aside>
      </div>
    </div>
  );
};

export default TaskDetails;
