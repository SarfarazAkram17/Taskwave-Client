import { Link } from "react-router";
import { LuBriefcase, LuCircleDollarSign, LuSearch, LuSend, LuTrophy, LuArrowRight, LuInbox } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { useAuth } from "../../Authentication/useAuth";
import { compactMoney, deadlineInfo, money, timeAgo } from "../../lib/format";
import PageHeader from "../../Components/ui/PageHeader";
import StatCard from "../../Components/ui/StatCard";
import Section from "../../Components/ui/Section";
import { BarChart } from "../../Components/ui/Charts";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { BidBadge, StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";
import { BID_STATUS } from "../../lib/constants";

const FreelancerOverview = () => {
  const { profile } = useAuth();
  const { data, error, loading, reload } = useAsync(() => api.get("/dashboard/stats"), []);
  if (loading && !data) return <PageLoader label="Loading your dashboard" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;
  const { totals: t } = data;

  return (
    <>
      <PageHeader title={`Welcome back, ${profile.name.split(" ")[0]}`} description="Your earnings, proposals and active jobs."
        actions={<Link to="/tasks" className="btn btn-primary"><LuSearch size={16} />Find work</Link>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total earned" value={money(t.earned)} icon={LuCircleDollarSign} tone="success" note={`${t.completed} completed ${t.completed === 1 ? "job" : "jobs"}`} />
        <StatCard label="Active jobs" value={t.active} icon={LuBriefcase} tone="warning" note={t.pipeline ? `${money(t.pipeline)} in progress` : "Nothing in progress"} />
        <StatCard label="Pending proposals" value={t.pending} icon={LuSend} tone="violet" note={`${t.proposals} sent in total`} />
        <StatCard label="Win rate" value={t.winRate === null ? "-" : `${t.winRate}%`} icon={LuTrophy} tone="primary" note={t.winRate === null ? "No decisions yet" : "Accepted vs. decided"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5 mt-6">
        <Section title="Earnings" description="Completed jobs, last 6 months" className="lg:col-span-3">
          <BarChart data={data.series.data} label="Earnings per month" format={compactMoney} />
        </Section>
        <Section title="Proposals" description="By outcome" className="lg:col-span-2">
          {t.proposals === 0 ? (
            <p className="text-muted text-sm">You haven't sent a proposal yet.</p>
          ) : (
            <ul className="list-none p-0 m-0 space-y-3">
              {Object.entries(BID_STATUS).map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3">
                  <BidBadge status={k} /><strong className="tabular-nums">{data.byBid[k] || 0}</strong>
                  <span className="sr-only">{v.label}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-4">
        <Section title="Active jobs" action={<Link to="/dashboard/jobs" className="btn btn-ghost btn-sm">View all</Link>}>
          {data.activeJobs.length === 0 ? (
            <EmptyState icon={LuInbox} title="No active jobs" action={<Link to="/tasks" className="btn btn-outline btn-sm">Browse tasks</Link>}>Once a client accepts your proposal, the job appears here.</EmptyState>
          ) : (
            <ul className="list-none p-0 m-0 divide-y divide-line">
              {data.activeJobs.map((j) => {
                const due = deadlineInfo(j.deadline);
                return (
                  <li key={j._id} className="py-3 flex items-center gap-3 justify-between flex-wrap">
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="font-semibold truncate">{j.title}</p>
                      <p className="text-xs text-muted mt-0.5 flex gap-2 items-center flex-wrap"><StatusBadge status={j.status} /><span className={due.tone === "danger" ? "text-danger" : ""}>{due.text}</span></p>
                    </div>
                    <Link to={`/dashboard/tasks/${j._id}`} className="btn btn-outline btn-sm">{j.status === "in_progress" ? "Deliver" : "View"}<LuArrowRight size={14} /></Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
        <Section title="Recent proposals" flush action={<Link to="/dashboard/proposals" className="btn btn-ghost btn-sm">View all</Link>}>
          {data.recentBids.length === 0 ? (
            <EmptyState icon={LuSend} title="No proposals yet">Find a task and send your first proposal.</EmptyState>
          ) : (
            <ResponsiveTable caption="Recent proposals" rows={data.recentBids} columns={[
              { header: "Task", primary: true, cell: (r) => r.task ? <Link to={`/tasks/${r.taskId}`} className="hover:text-primary">{r.task.title}</Link> : "Deleted task" },
              { header: "Your price", cell: (r) => money(r.amount) },
              { header: "Sent", cell: (r) => timeAgo(r.createdAt) },
              { header: "Status", cell: (r) => <BidBadge status={r.status} /> },
            ]} />
          )}
        </Section>
      </div>
    </>
  );
};

export default FreelancerOverview;
