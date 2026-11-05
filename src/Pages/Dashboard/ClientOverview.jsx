import { Link } from "react-router";
import { LuArrowRight, LuClipboardList, LuFilePlus2, LuHourglass, LuInbox, LuMessagesSquare, LuWallet, LuEye } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { useAuth } from "../../Authentication/useAuth";
import { money } from "../../lib/format";
import PageHeader from "../../Components/ui/PageHeader";
import StatCard from "../../Components/ui/StatCard";
import Section from "../../Components/ui/Section";
import { BarChart, StatusBar } from "../../Components/ui/Charts";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { StatusBadge } from "../../Components/ui/StatusBadge";
import { EmptyState, ErrorState, PageLoader } from "../../Components/ui/Feedback";

const Attention = ({ review, proposals }) => {
  const items = [
    ...review.map((t) => ({ t, label: "Delivery ready for review", tone: "badge-violet", cta: "Review" })),
    ...proposals.map((t) => ({ t, label: `${t.proposals} ${t.proposals === 1 ? "proposal" : "proposals"} waiting`, tone: "badge-warning", cta: "Compare" })),
  ];
  if (!items.length) {
    return <EmptyState icon={LuInbox} title="You're all caught up">Nothing needs your attention right now.</EmptyState>;
  }
  return (
    <ul className="list-none p-0 m-0 divide-y divide-line">
      {items.map(({ t, label, tone, cta }) => (
        <li key={`${t._id}${cta}`} className="py-3 flex items-center gap-3 justify-between flex-wrap">
          <div className="min-w-0 flex-1 basis-48">
            <p className="font-semibold truncate">{t.title}</p>
            <span className={`badge mt-1 ${tone}`}>{label}</span>
          </div>
          <Link to={`/dashboard/tasks/${t._id}`} className="btn btn-outline btn-sm">{cta}<LuArrowRight size={14} /></Link>
        </li>
      ))}
    </ul>
  );
};

const ClientOverview = () => {
  const { profile } = useAuth();
  const { data, error, loading, reload } = useAsync(() => api.get("/dashboard/stats"), []);
  if (loading && !data) return <PageLoader label="Loading your dashboard" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;
  const { totals: t } = data;

  return (
    <>
      <PageHeader title={`Welcome back, ${profile.name.split(" ")[0]}`} description="Here's what's happening with your tasks."
        actions={<Link to="/dashboard/post-task" className="btn btn-primary"><LuFilePlus2 size={16} />Post a task</Link>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Open tasks" value={t.open} icon={LuClipboardList} tone="primary" note={`${t.tasks} posted in total`} />
        <StatCard label="In progress" value={t.active} icon={LuHourglass} tone="warning" note="With a freelancer" />
        <StatCard label="Proposals to review" value={t.pendingProposals} icon={LuMessagesSquare} tone="violet" />
        <StatCard label="Total spent" value={money(t.spent)} icon={LuWallet} tone="success" note={t.committed ? `${money(t.committed)} committed` : "On completed tasks"} />
      </div>

      {t.tasks === 0 ? (
        <div className="card mt-6">
          <EmptyState icon={LuFilePlus2} title="Post your first task"
            action={<Link to="/dashboard/post-task" className="btn btn-primary">Post a task</Link>}>
            Describe what you need, set a budget, and freelancers will send proposals.
          </EmptyState>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-5 mt-6">
            <Section title="Tasks posted" description="Last 6 months" className="lg:col-span-3"><BarChart data={data.series.data} label="Tasks posted per month" /></Section>
            <Section title="Task status" className="lg:col-span-2"><StatusBar counts={data.byStatus} /></Section>
          </div>
          <div className="grid gap-4 lg:grid-cols-5 mt-4">
            <Section title="Needs your attention" className="lg:col-span-2"><Attention review={data.attention.review} proposals={data.attention.proposals} /></Section>
            <Section title="Recent tasks" flush className="lg:col-span-3"
              action={<Link to="/dashboard/my-tasks" className="btn btn-ghost btn-sm">View all</Link>}>
              <ResponsiveTable caption="Recent tasks" rows={data.recent} columns={[
                { header: "Task", primary: true, cell: (r) => <Link to={`/dashboard/tasks/${r._id}`} className="hover:text-primary">{r.title}</Link> },
                { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
                { header: "Budget", cell: (r) => money(r.budget) },
                { header: "Proposals", cell: (r) => r.proposals },
                { header: "", actions: true, cell: (r) => <Link to={`/dashboard/tasks/${r._id}`} className="btn btn-outline btn-sm"><LuEye size={14} />Open</Link> },
              ]} />
            </Section>
          </div>
        </>
      )}
    </>
  );
};

export default ClientOverview;
