import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { LuArrowLeft, LuCheck, LuExternalLink, LuPencil, LuTrash2, LuX, LuMessagesSquare, LuRotateCcw, LuSend, LuInbox, LuHourglass, LuPartyPopper } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { useAuth } from "../../Authentication/useAuth";
import { deadlineInfo, formatDate, money, timeAgo } from "../../lib/format";
import { useConfirm } from "../../Components/ui/confirmContext";
import Section from "../../Components/ui/Section";
import Avatar from "../../Components/ui/Avatar";
import Field from "../../Components/ui/Field";
import { BidBadge, StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";
import StatusStepper from "../../Components/StatusStepper";

const Notice = ({ tone = "info", icon: Icon, title, children }) => {
  const tones = { info: "bg-primary-soft text-primary", warning: "bg-warning-soft text-warning", success: "bg-success-soft text-success", violet: "bg-violet-soft text-violet" };
  return (
    <div className={`rounded-xl p-4 flex gap-3 ${tones[tone]}`} role="status">
      {Icon && <Icon size={20} className="shrink-0 mt-0.5" aria-hidden="true" />}
      <div className="min-w-0"><p className="font-semibold">{title}</p>{children && <div className="text-sm mt-1 text-ink opacity-90">{children}</div>}</div>
    </div>
  );
};

const Proposals = ({ task, onChange }) => {
  const { data, error, loading, reload } = useAsync(() => api.get(`/tasks/${task._id}/bids`), [task._id, task.status, task.proposals]);
  const confirm = useConfirm();
  const [busy, setBusy] = useState(null);

  const act = async (bid, kind) => {
    if (kind === "accept" && !(await confirm({
      title: `Accept ${bid.freelancerName}'s proposal?`,
      message: `The task will move to "In progress" at ${money(bid.amount)} and all other proposals will be marked as not selected.`,
      confirmLabel: "Accept proposal",
    }))) return;
    setBusy(bid._id);
    try {
      await api.post(`/bids/${bid._id}/${kind}`);
      toast.success(kind === "accept" ? "Proposal accepted. The freelancer can start now." : "Proposal declined");
      kind === "accept" ? onChange() : reload();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  if (loading && !data) return <PageLoader label="Loading proposals" className="min-h-32" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data.length) return <EmptyState icon={LuInbox} title="No proposals yet">Freelancers can send proposals while the task is open. Check back soon.</EmptyState>;

  return (
    <ul className="list-none p-0 m-0 divide-y divide-line">
      {data.map((b) => (
        <li key={b._id} className={`py-4 first:pt-0 last:pb-0 ${b.status === "withdrawn" ? "opacity-60" : ""}`}>
          <div className="flex items-start gap-3">
            <Avatar name={b.freelancerName} src={b.freelancerPhoto} size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-x-3 gap-y-1 flex-wrap">
                <div className="min-w-0">
                  <p className="font-semibold">{b.freelancerName}</p>
                  {b.freelancerHeadline && <p className="text-xs text-muted">{b.freelancerHeadline}</p>}
                </div>
                <BidBadge status={b.status} />
              </div>
              <div className="flex gap-x-5 gap-y-1 flex-wrap text-sm mt-2">
                <span><strong className="font-display text-lg tabular-nums">{money(b.amount)}</strong>{b.amount !== task.budget && <span className={`text-xs ml-1 ${b.amount < task.budget ? "text-success" : "text-warning"}`}>{b.amount < task.budget ? "under" : "over"} budget</span>}</span>
                <span className="text-muted self-end">{b.deliveryDays} {b.deliveryDays === 1 ? "day" : "days"}</span>
                <span className="text-faint self-end">{timeAgo(b.createdAt)}</span>
              </div>
              <p className="prose-sm mt-2">{b.message}</p>
              {b.status === "pending" && task.status === "open" && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button className="btn btn-primary btn-sm" disabled={busy === b._id} onClick={() => act(b, "accept")}><LuCheck size={14} />Accept</button>
                  <button className="btn btn-outline btn-sm" disabled={busy === b._id} onClick={() => act(b, "reject")}><LuX size={14} />Decline</button>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const Delivery = ({ s }) => (
  <div className="rounded-xl border border-line bg-surface-2 p-4">
    <p className="text-xs text-muted mb-1">Delivered {timeAgo(s.submittedAt)}</p>
    <p className="prose-sm !text-ink">{s.note}</p>
    {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm mt-3 max-w-full"><LuExternalLink size={14} className="shrink-0" /><span className="truncate">Open delivery link</span></a>}
  </div>
);

const ReviewPanel = ({ task, onChange }) => {
  const [mode, setMode] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();

  const send = async (action) => {
    if (action === "approve" && !(await confirm({ title: "Approve this delivery?", message: "The task will be marked as completed.", confirmLabel: "Approve and complete" }))) return;
    if (action === "revise" && feedback.trim().length < 5) return toast.error("Tell the freelancer what to change (at least 5 characters)");
    setBusy(true);
    try {
      await api.post(`/tasks/${task._id}/review`, { action, feedback });
      toast.success(action === "approve" ? "Task completed" : "Changes requested");
      onChange();
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      {task.submission && <Delivery s={task.submission} />}
      {mode === "revise" ? (
        <div className="space-y-3">
          <Field label="What should change?">{(p) => <textarea {...p} className="textarea" value={feedback} onChange={(e) => setFeedback(e.target.value)} maxLength={2000} autoFocus placeholder="Be specific so the freelancer can fix it in one go." />}</Field>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" disabled={busy} onClick={() => send("revise")}><LuRotateCcw size={16} />Send feedback</button>
            <button className="btn btn-ghost" onClick={() => setMode(null)}>Back</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-success" disabled={busy} onClick={() => send("approve")}><LuCheck size={16} />Approve delivery</button>
          <button className="btn btn-outline" onClick={() => setMode("revise")}><LuRotateCcw size={16} />Request changes</button>
        </div>
      )}
    </div>
  );
};

const DeliveryForm = ({ task, onChange }) => {
  const [form, setForm] = useState({ note: "", link: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    if (form.note.trim().length < 10) return toast.error("Add a delivery note of at least 10 characters");
    setBusy(true);
    try { await api.post(`/tasks/${task._id}/submit`, form); toast.success("Delivered. The client will review it."); onChange(); }
    catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {task.feedback && <Notice tone="warning" icon={LuRotateCcw} title="The client requested changes">{task.feedback}</Notice>}
      <Field label="Delivery note" hint="Summarise what you did and anything the client should check.">
        {(p) => <textarea {...p} className="textarea" value={form.note} onChange={set("note")} maxLength={3000} placeholder="Describe what you're delivering." />}
      </Field>
      <Field label="Link to the files" optional hint="Drive, Dropbox, GitHub, Figma… anywhere the client can open it.">
        {(p) => <input {...p} className="input" inputMode="url" value={form.link} onChange={set("link")} placeholder="https://…" />}
      </Field>
      <button className="btn btn-primary" disabled={busy}><LuSend size={16} />{busy ? "Submitting…" : task.feedback ? "Submit revised work" : "Submit work for review"}</button>
    </form>
  );
};

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 py-2.5 text-sm"><dt className="text-muted shrink-0">{label}</dt><dd className="m-0 font-medium text-right min-w-0">{children}</dd></div>
);

const TaskWorkspace = () => {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { data: task, error, loading, reload } = useAsync(() => api.get(`/tasks/${id}`), [id]);

  if (loading && !task) return <PageLoader label="Loading task" />;
  if (error && !task) return <ErrorState error={error} onRetry={reload} />;
  const isOwner = task.isOwner, isAssignee = task.isAssignee, isAdmin = role === "admin";
  if (!isOwner && !isAssignee && !isAdmin) return <Navigate to={`/tasks/${id}`} replace />;
  const manager = isOwner || isAdmin;
  const due = deadlineInfo(task.deadline);

  const cancel = async () => {
    if (!(await confirm({ title: "Cancel this task?", message: task.status === "open" ? "It will be closed and pending proposals will be declined." : "The assigned freelancer will no longer be working on it.", confirmLabel: "Cancel task", cancelLabel: "Keep task", danger: true }))) return;
    try { await api.post(`/tasks/${task._id}/cancel`, {}); toast.success("Task cancelled"); reload(); } catch (e) { toast.error(e.message); }
  };
  const remove = async () => {
    if (!(await confirm({ title: "Delete this task?", message: "The task and all its proposals will be permanently removed.", confirmLabel: "Delete task", danger: true }))) return;
    try { await api.delete(`/tasks/${task._id}`); toast.success("Task deleted"); navigate(isOwner ? "/dashboard/my-tasks" : "/dashboard/tasks"); } catch (e) { toast.error(e.message); }
  };

  const back = isAssignee ? ["/dashboard/jobs", "My jobs"] : isOwner ? ["/dashboard/my-tasks", "My tasks"] : ["/dashboard/tasks", "All tasks"];
  const canCancel = task.status === "open" ? manager : isAdmin && ["in_progress", "in_review"].includes(task.status);
  const canDelete = manager && (isAdmin || !["in_progress", "in_review"].includes(task.status));

  return (
    <>
      <Link to={back[0]} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-3"><LuArrowLeft size={16} />{back[1]}</Link>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2"><span className="badge badge-plain">{task.category}</span><StatusBadge status={task.status} /></div>
          <h1 className="text-2xl sm:text-3xl">{task.title}</h1>
          <Link to={`/tasks/${task._id}`} className="text-sm text-primary hover:underline mt-1 inline-block">View public page</Link>
        </div>
        {manager && (
          <div className="flex flex-wrap gap-2 shrink-0">
            {task.status === "open" && <Link to={`/dashboard/edit-task/${task._id}`} className="btn btn-outline btn-sm"><LuPencil size={14} />Edit</Link>}
            {canCancel && <button className="btn btn-outline btn-sm" onClick={cancel}><LuX size={14} />Cancel task</button>}
            {canDelete && <button className="btn btn-danger btn-sm" onClick={remove}><LuTrash2 size={14} />Delete</button>}
          </div>
        )}
      </div>

      <div className="card card-pad mb-4"><StatusStepper status={task.status} /></div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem] items-start">
        <div className="space-y-4 min-w-0">
          {/* Next step for the viewer */}
          {task.status === "in_review" && manager && (
            <Section title="Review the delivery" description={`${task.assignedTo?.name} submitted work for approval.`}><ReviewPanel task={task} onChange={reload} /></Section>
          )}
          {task.status === "in_progress" && isAssignee && (
            <Section title="Deliver your work" description="Submit it when it's ready for the client to review."><DeliveryForm task={task} onChange={reload} /></Section>
          )}
          {task.status === "in_progress" && manager && !isAssignee && (
            <Notice tone="warning" icon={LuHourglass} title={`${task.assignedTo?.name || "The freelancer"} is working on this task`}>
              {task.feedback ? `You asked for changes: "${task.feedback}"` : "You'll be notified here when the delivery is ready for review."}
            </Notice>
          )}
          {task.status === "in_review" && isAssignee && (
            <>
              <Notice tone="violet" icon={LuHourglass} title="Waiting for the client's review">The client is reviewing your delivery. You'll see the result here.</Notice>
              {task.submission && <Section title="Your delivery"><Delivery s={task.submission} /></Section>}
            </>
          )}
          {task.status === "completed" && (
            <Notice tone="success" icon={LuPartyPopper} title="This task is completed">{isAssignee ? `Great work. ${money(task.acceptedAmount)} agreed.` : "The delivery was approved."}</Notice>
          )}
          {task.status === "cancelled" && <Notice tone="warning" icon={LuX} title="This task was cancelled">{task.cancelReason}</Notice>}

          <Section title="Task details"><p className="prose-sm">{task.description}</p></Section>

          {manager && (task.status === "open" || task.proposals > 0 || task.assignedTo) && (
            <Section title="Proposals" description={task.status === "open" ? "Compare and choose the freelancer you want to work with." : "Proposal history for this task."}
              action={<span className="badge badge-plain"><LuMessagesSquare size={13} />{task.proposals}</span>}>
              <Proposals task={task} onChange={reload} />
            </Section>
          )}
          {["completed"].includes(task.status) && manager && task.submission && <Section title="Final delivery"><Delivery s={task.submission} /></Section>}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 min-w-0">
          <Section title="Summary">
            <dl className="m-0 divide-y divide-line -mt-1">
              <Row label="Budget">{money(task.budget)}</Row>
              {task.acceptedAmount && <Row label="Agreed price">{money(task.acceptedAmount)}</Row>}
              <Row label="Deadline">{formatDate(task.deadline)}{!["completed", "cancelled"].includes(task.status) && <span className={`block text-xs font-normal ${due.tone === "danger" ? "text-danger" : "text-muted"}`}>{due.text}</span>}</Row>
              <Row label="Posted">{timeAgo(task.createdAt)}</Row>
              <Row label="Proposals">{task.proposals}</Row>
            </dl>
          </Section>
          <Section title="People">
            <ul className="list-none p-0 m-0 space-y-4">
              <li className="flex items-center gap-3 min-w-0"><Avatar name={task.name} src={task.ownerPhoto} size={36} /><div className="min-w-0"><p className="text-xs text-muted">Client</p><p className="font-semibold truncate">{task.name}</p>{task.email && manager && <p className="text-xs text-muted truncate">{task.email}</p>}</div></li>
              <li className="flex items-center gap-3 min-w-0">
                {task.assignedTo ? (<><Avatar name={task.assignedTo.name} src={task.assignedTo.photo} size={36} /><div className="min-w-0"><p className="text-xs text-muted">Freelancer</p><p className="font-semibold truncate">{task.assignedTo.name}</p>{manager && <p className="text-xs text-muted truncate">{task.assignedTo.email}</p>}</div></>)
                  : <p className="text-sm text-muted">No freelancer selected yet.</p>}
              </li>
            </ul>
          </Section>
        </aside>
      </div>
    </>
  );
};

export default TaskWorkspace;
