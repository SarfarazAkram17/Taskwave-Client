import { Link } from "react-router";
import { LuUsers, LuListChecks, LuCircleDollarSign, LuSend, LuUserCheck, LuUserX, LuBriefcase, LuWallet } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { formatDate, money, timeAgo } from "../../lib/format";
import PageHeader from "../../Components/ui/PageHeader";
import StatCard from "../../Components/ui/StatCard";
import Section from "../../Components/ui/Section";
import { BarChart, StatusBar } from "../../Components/ui/Charts";
import ResponsiveTable from "../../Components/ui/ResponsiveTable";
import { StatusBadge } from "../../Components/ui/StatusBadge";
import Avatar from "../../Components/ui/Avatar";
import { ErrorState, PageLoader } from "../../Components/ui/Feedback";
import { ROLE_LABEL } from "../../lib/constants";

const AdminOverview = () => {
  const { data, error, loading, reload } = useAsync(() => api.get("/dashboard/stats"), []);
  if (loading && !data) return <PageLoader label="Loading platform overview" />;
  if (error && !data) return <ErrorState error={error} onRetry={reload} />;
  const { totals: t } = data;

  return (
    <>
      <PageHeader title="Platform overview" description="Users, tasks and marketplace activity."
        actions={<><Link to="/dashboard/users" className="btn btn-outline"><LuUsers size={16} />Manage users</Link><Link to="/dashboard/tasks" className="btn btn-primary"><LuListChecks size={16} />Moderate tasks</Link></>} />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total users" value={t.users} icon={LuUsers} tone="primary" note={`${t.clients} clients · ${t.freelancers} freelancers`} />
        <StatCard label="Total tasks" value={t.tasks} icon={LuListChecks} tone="violet" note={`${money(t.openBudget)} open budget`} />
        <StatCard label="Completed volume" value={money(t.volume)} icon={LuCircleDollarSign} tone="success" note="Accepted prices, completed tasks" />
        <StatCard label="Proposals sent" value={t.proposals} icon={LuSend} tone="warning" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
        <StatCard label="Clients" value={t.clients} icon={LuBriefcase} tone="primary" />
        <StatCard label="Freelancers" value={t.freelancers} icon={LuUserCheck} tone="success" />
        <StatCard label="Admins" value={t.admins} icon={LuWallet} tone="violet" />
        <StatCard label="Suspended" value={t.suspended} icon={LuUserX} tone="danger" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Section title="New users" description="Last 6 months"><BarChart data={data.series.data} label="New users per month" /></Section>
        <Section title="Tasks posted" description="Last 6 months"><BarChart data={data.seriesTasks.data} label="Tasks posted per month" /></Section>
      </div>
      <div className="grid gap-4 lg:grid-cols-3 mt-4">
        <Section title="Task status" className="lg:col-span-1"><StatusBar counts={data.byStatus} /></Section>
        <Section title="Newest members" flush className="lg:col-span-2" action={<Link to="/dashboard/users" className="btn btn-ghost btn-sm">View all</Link>}>
          <ResponsiveTable caption="Newest members" rows={data.recentUsers} columns={[
            { header: "User", primary: true, cell: (u) => <span className="flex items-center gap-2.5 min-w-0"><Avatar name={u.name} src={u.photo} size={28} /><span className="min-w-0"><span className="block truncate">{u.name}</span><span className="block text-xs text-muted font-normal truncate">{u.email}</span></span></span> },
            { header: "Role", cell: (u) => ROLE_LABEL[u.role] },
            { header: "Joined", cell: (u) => timeAgo(u.createdAt) },
          ]} />
        </Section>
      </div>
      <Section title="Latest tasks" flush className="mt-4" action={<Link to="/dashboard/tasks" className="btn btn-ghost btn-sm">View all</Link>}>
        <ResponsiveTable caption="Latest tasks" rows={data.recentTasks} columns={[
          { header: "Task", primary: true, cell: (r) => <Link to={`/dashboard/tasks/${r._id}`} className="hover:text-primary">{r.title}</Link> },
          { header: "Client", cell: (r) => r.name },
          { header: "Budget", cell: (r) => money(r.budget) },
          { header: "Deadline", cell: (r) => formatDate(r.deadline) },
          { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
        ]} />
      </Section>
    </>
  );
};

export default AdminOverview;
