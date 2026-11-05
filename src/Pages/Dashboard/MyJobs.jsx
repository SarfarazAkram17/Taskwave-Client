import { useState } from "react";
import { Link } from "react-router";
import { LuBriefcase } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { deadlineInfo, formatDate, money } from "../../lib/format";
import PageHeader from "../../Components/ui/PageHeader";
import Tabs from "../../Components/ui/Tabs";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";

const GROUPS = {
  active: (t) => t.status === "in_progress" || t.status === "in_review",
  completed: (t) => t.status === "completed",
  other: (t) => t.status === "cancelled",
};

const MyJobs = () => {
  const { data, error, loading, reload } = useAsync(() => api.get("/jobs/mine"), []);
  const [tab, setTab] = useState("active");
  if (loading && !data) return <PageLoader label="Loading your jobs" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;

  const tabs = [
    { value: "active", label: "Active", count: data.filter(GROUPS.active).length },
    { value: "completed", label: "Completed", count: data.filter(GROUPS.completed).length },
    { value: "other", label: "Cancelled", count: data.filter(GROUPS.other).length },
  ];
  const rows = data.filter(GROUPS[tab]);

  return (
    <>
      <PageHeader title="My jobs" description="Tasks where a client accepted your proposal." />
      {data.length === 0 ? (
        <div className="card"><EmptyState icon={LuBriefcase} title="No jobs yet" action={<Link to="/tasks" className="btn btn-primary">Find work</Link>}>When a client accepts your proposal, the job shows up here.</EmptyState></div>
      ) : (
        <>
          <Tabs tabs={tabs} value={tab} onChange={setTab} label="Filter jobs" />
          <div className="card mt-4 overflow-hidden">
            {rows.length === 0 ? <EmptyState title="Nothing here yet" /> : (
              <ResponsiveTable caption="My jobs" rows={rows} columns={[
                { header: "Job", primary: true, cell: (t) => <Link to={`/dashboard/tasks/${t._id}`} className="hover:text-primary"><span className="block">{t.title}</span><span className="block text-xs text-muted font-normal">for {t.name}</span></Link> },
                { header: "Agreed price", cell: (t) => money(t.acceptedAmount ?? t.budget) },
                { header: "Deadline", cell: (t) => <>{formatDate(t.deadline)}{t.status === "in_progress" && <span className={`block text-xs ${deadlineInfo(t.deadline).tone === "danger" ? "text-danger" : "text-muted"}`}>{deadlineInfo(t.deadline).text}</span>}</> },
                { header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
                { header: "Actions", actions: true, cell: (t) => <Link to={`/dashboard/tasks/${t._id}`} className={`btn btn-sm ${t.status === "in_progress" ? "btn-primary" : "btn-outline"}`}>{t.status === "in_progress" ? "Deliver work" : "Open"}</Link> },
              ]} />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyJobs;
