import { useState } from "react";
import { Link } from "react-router";
import { LuSearch, LuSend } from "react-icons/lu";
import { toast } from "react-toastify";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { BID_STATUS } from "../../lib/constants";
import { money, timeAgo } from "../../lib/format";
import { useConfirm } from "../../Components/ui/confirmContext";
import PageHeader from "../../Components/ui/PageHeader";
import Tabs from "../../Components/ui/Tabs";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { BidBadge, StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";

const MyProposals = () => {
  const { data, error, loading, reload, setData } = useAsync(() => api.get("/bids/mine"), []);
  const [tab, setTab] = useState("all");
  const confirm = useConfirm();
  if (loading && !data) return <PageLoader label="Loading your proposals" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;

  const tabs = [{ value: "all", label: "All", count: data.length }, ...Object.entries(BID_STATUS).map(([k, v]) => ({ value: k, label: v.label, count: data.filter((b) => b.status === k).length }))];
  const rows = tab === "all" ? data : data.filter((b) => b.status === tab);

  const withdraw = async (b) => {
    if (!(await confirm({ title: "Withdraw this proposal?", message: "The client will no longer see it. You can send a new one while the task is open.", confirmLabel: "Withdraw", danger: true }))) return;
    try { await api.delete(`/bids/${b._id}`); setData((d) => d.map((x) => (x._id === b._id ? { ...x, status: "withdrawn" } : x))); toast.success("Proposal withdrawn"); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="My proposals" description="Track every proposal you've sent and its outcome."
        actions={<Link to="/tasks" className="btn btn-primary"><LuSearch size={16} />Find work</Link>} />
      {data.length === 0 ? (
        <div className="card"><EmptyState icon={LuSend} title="No proposals yet" action={<Link to="/tasks" className="btn btn-primary">Browse tasks</Link>}>Find a task that fits your skills and send your first proposal.</EmptyState></div>
      ) : (
        <>
          <Tabs tabs={tabs} value={tab} onChange={setTab} label="Filter by outcome" />
          <div className="card mt-4 overflow-hidden">
            {rows.length === 0 ? <EmptyState title="Nothing here" /> : (
              <ResponsiveTable caption="My proposals" rows={rows} columns={[
                { header: "Task", primary: true, cell: (b) => b.task ? (
                  <Link to={`/tasks/${b.taskId}`} className="hover:text-primary"><span className="block">{b.task.title}</span><span className="block text-xs text-muted font-normal">{b.task.clientName}</span></Link>) : "Task removed" },
                { header: "Your price", cell: (b) => <>{money(b.amount)}{b.task && b.amount !== b.task.budget && <span className="block text-xs text-muted">Budget {money(b.task.budget)}</span>}</> },
                { header: "Delivery", cell: (b) => `${b.deliveryDays} days` },
                { header: "Sent", cell: (b) => timeAgo(b.createdAt) },
                { header: "Proposal", cell: (b) => <BidBadge status={b.status} /> },
                { header: "Task status", cell: (b) => (b.task ? <StatusBadge status={b.task.status} /> : "-") },
                { header: "Actions", actions: true, cell: (b) => (
                  <div className="flex gap-2">
                    {b.status === "accepted" && b.task && <Link to={`/dashboard/tasks/${b.taskId}`} className="btn btn-primary btn-sm">Open workspace</Link>}
                    {b.task && b.status !== "accepted" && <Link to={`/tasks/${b.taskId}`} className="btn btn-outline btn-sm">View task</Link>}
                    {b.status === "pending" && <button className="btn btn-danger btn-sm" onClick={() => withdraw(b)}>Withdraw</button>}
                  </div>) },
              ]} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyProposals;
