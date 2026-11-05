import { useState } from "react";
import { Link } from "react-router";
import { LuEye, LuListChecks, LuSearch, LuTrash2, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync, useDebounced } from "../../lib/useAsync";
import { STATUS } from "../../lib/constants";
import { formatDate, money } from "../../lib/format";
import { useConfirm } from "../../Components/ui/confirmContext";
import PageHeader from "../../Components/ui/PageHeader";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import Pagination from "../../Components/ui/Pagination";
import { StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";

const AdminTasks = () => {
  const confirm = useConfirm();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const dq = useDebounced(q);
  const { data, error, loading, reload } = useAsync(() => api.get("/admin/tasks", { q: dq, status, page, limit: 10 }), [dq, status, page]);

  const cancel = async (t) => {
    if (!(await confirm({ title: "Cancel this task?", message: `"${t.title}" will be closed.`, confirmLabel: "Cancel task", cancelLabel: "Keep", danger: true }))) return;
    try { await api.post(`/tasks/${t._id}/cancel`, { reason: "Cancelled by an administrator" }); toast.success("Task cancelled"); reload(); } catch (e) { toast.error(e.message); }
  };
  const remove = async (t) => {
    if (!(await confirm({ title: "Delete this task?", message: "It and all its proposals will be permanently removed.", confirmLabel: "Delete task", danger: true }))) return;
    try { await api.delete(`/tasks/${t._id}`); toast.success("Task deleted"); reload(); } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="All tasks" description="Review and moderate every task on the platform." />
      <div className="card card-pad !p-3 sm:!p-4 grid gap-3 sm:grid-cols-[1fr_auto] mb-4">
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" size={18} aria-hidden="true" />
          <input className="input !pl-10" type="search" aria-label="Search tasks" placeholder="Search tasks" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select className="select sm:w-44" aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="all">All statuses</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      {loading && !data ? <PageLoader label="Loading tasks" /> : error && !data ? <ErrorState error={error} onRetry={reload} /> : (
        <>
          <div className="card overflow-hidden">
            {data.items.length === 0 ? <EmptyState icon={LuListChecks} title="No tasks found">Try a different search or filter.</EmptyState> : (
              <ResponsiveTable caption="All tasks" rows={data.items} columns={[
                { header: "Task", primary: true, cell: (t) => <Link to={`/dashboard/tasks/${t._id}`} className="hover:text-primary"><span className="block">{t.title}</span><span className="block text-xs text-muted font-normal">{t.category}</span></Link> },
                { header: "Client", cell: (t) => <span className="block truncate max-w-48">{t.name}</span> },
                { header: "Budget", cell: (t) => money(t.budget) },
                { header: "Proposals", cell: (t) => t.proposals },
                { header: "Deadline", cell: (t) => formatDate(t.deadline) },
                { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
                { header: "Actions", actions: true, cell: (t) => (
                  <div className="flex gap-2">
                    <Link to={`/dashboard/tasks/${t._id}`} className="btn btn-outline btn-sm"><LuEye size={14} />View</Link>
                    {["open", "in_progress", "in_review"].includes(t.status) && <button className="btn btn-outline btn-sm" onClick={() => cancel(t)}><LuX size={14} />Cancel</button>}
                    <button className="btn btn-danger btn-sm" onClick={() => remove(t)} aria-label={`Delete ${t.title}`}><LuTrash2 size={14} />Delete</button>
                  </div>) },
              ]} />
            )}
          </div>
          <p className="text-sm text-muted mt-3">{data.total} {data.total === 1 ? "task" : "tasks"}</p>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
};

export default AdminTasks;
