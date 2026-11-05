import { Link } from "react-router";
import { LuArrowRight, LuCheck, LuFileText, LuHandshake, LuSend, LuShieldCheck, LuBadgeCheck, LuLayoutDashboard } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync } from "../../lib/useAsync";
import { CATEGORIES } from "../../lib/constants";
import { useAuth } from "../../Authentication/useAuth";
import TaskCard from "../../Components/TaskCard";
import { Wave } from "../../Components/Wave";
import { CardSkeletons } from "../../Components/ui/Feedback";
import Avatar from "../../Components/ui/Avatar";

const FLOW = ["Open", "In progress", "In review", "Completed"];

const HeroPanel = () => (
  <div className="card shadow-lg p-4 sm:p-6 w-full max-w-md ml-auto relative" aria-label="Example of a task moving through TaskWave" role="group">
    <p className="text-xs text-faint mb-3">Example task</p>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted">Web Development</p>
        <h3 className="text-lg mt-0.5">Landing page for a bakery</h3>
      </div>
      <p className="font-display text-xl font-bold shrink-0">$450</p>
    </div>
    <ol className="mt-5 space-y-3 list-none p-0 m-0">
      {FLOW.map((s, i) => {
        const done = i < 2, now = i === 2;
        return (
          <li key={s} className="flex items-center gap-3">
            <span className={`grid place-items-center w-6 h-6 rounded-full text-xs shrink-0 ${done ? "bg-success text-white" : now ? "bg-violet text-white" : "bg-surface-2 text-faint"}`} style={now ? { color: "var(--on-primary)" } : undefined}>
              {done ? <LuCheck size={13} /> : i + 1}
            </span>
            <span className={`text-sm ${now ? "font-semibold" : done ? "text-muted" : "text-faint"}`}>{s}</span>
            {now && <span className="badge badge-violet ml-auto">Awaiting approval</span>}
          </li>
        );
      })}
    </ol>
    <div className="mt-5 pt-4 border-t border-line flex items-center gap-2.5">
      <div className="flex -space-x-2">
        {["Maya R.", "Jon K.", "Ana P."].map((n) => <Avatar key={n} name={n} size={28} className="ring-2 ring-[var(--surface)]" />)}
      </div>
      <p className="text-xs text-muted">3 proposals received, 1 accepted</p>
    </div>
  </div>
);

const STEPS = [
  { icon: LuFileText, title: "Post a task", text: "Describe what you need, set a budget and a deadline. It goes live right away." },
  { icon: LuSend, title: "Compare proposals", text: "Freelancers send a price, a timeline and a short pitch. Review them side by side." },
  { icon: LuHandshake, title: "Accept and collaborate", text: "Accept one proposal. The task locks to that freelancer and the others are notified." },
  { icon: LuBadgeCheck, title: "Review and approve", text: "The freelancer delivers. You approve it or ask for changes until it's right." },
];

const FAQ = [
  ["What is TaskWave?", "TaskWave is a marketplace where clients post tasks and freelancers send proposals. Each task moves through a clear lifecycle: open, in progress, in review, and completed."],
  ["Do I need separate accounts to hire and to work?", "You choose a role when you sign up: client to hire, or freelancer to work. Each role has its own dashboard with the tools it needs."],
  ["How do I choose a freelancer?", "Open your task and review every proposal with its price, delivery time and message. Accept the one you prefer; the rest are automatically marked as not selected."],
  ["Can I edit or cancel a task?", "Yes, while it's open. Once you accept a proposal the task is locked to protect the freelancer's work, but you can still request changes on the delivery."],
  ["Can freelancers send many proposals?", "Yes. Send one proposal per task, as many tasks as you like. You can withdraw a pending proposal at any time and send a new one."],
];

const Home = () => {
  const { user, profile } = useAuth();
  const featured = useAsync(() => api.get("/featuredTasks"), []);
  const stats = useAsync(() => api.get("/stats/public").catch(() => null), []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <Wave className="absolute inset-x-0 bottom-0 h-40 sm:h-56" />
        <div className="page-container relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-center py-14 sm:py-20 lg:py-24">
          <div>
            <p className="badge badge-info badge-plain mb-5"><LuShieldCheck size={14} /> Every task tracked from brief to delivery</p>
            <h1 className="text-[2.125rem] xs:text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              Hire skilled freelancers for the work you don't have time for.
            </h1>
            <p className="text-muted text-base sm:text-lg mt-5 max-w-xl">
              Post a task, compare proposals from freelancers, and approve the delivery when it's right. Clients and freelancers each get a dashboard built for how they work.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 mt-8">
              {profile ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg"><LuLayoutDashboard size={18} />Open your dashboard</Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-lg">Create free account <LuArrowRight size={18} /></Link>
              )}
              <Link to="/tasks" className="btn btn-outline btn-lg">Browse open tasks</Link>
            </div>
            {!user && <p className="text-sm text-faint mt-4">No card needed. Sign up as a client or a freelancer.</p>}
          </div>
          <HeroPanel />
        </div>
      </section>

      {/* Live numbers */}
      {stats.data && (stats.data.openTasks > 0 || stats.data.freelancers > 0) && (
        <section className="page-container -mt-px">
          <dl className="grid grid-cols-3 divide-x divide-line card !rounded-none sm:!rounded-b-2xl border-t-0 text-center">
            {[["Open tasks", stats.data.openTasks], ["Freelancers", stats.data.freelancers], ["Tasks completed", stats.data.completed]].map(([label, n]) => (
              <div key={label} className="py-4 px-2">
                <dd className="font-display text-xl sm:text-3xl font-bold tabular-nums order-1">{n}</dd>
                <dt className="text-[0.6875rem] sm:text-sm text-muted">{label}</dt>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Featured */}
      <section className="page-container pt-16 sm:pt-20">
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-4xl">Tasks closing soon</h2>
            <p className="text-muted mt-2">Open tasks with the nearest deadlines. Send a proposal before they fill up.</p>
          </div>
          <Link to="/tasks" className="btn btn-outline">View all tasks <LuArrowRight size={16} /></Link>
        </div>
        {featured.loading && !featured.data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><CardSkeletons count={3} /></div>
        ) : featured.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((t) => <TaskCard key={t._id} task={t} />)}
          </div>
        ) : (
          <div className="card card-pad text-center text-muted">
            {featured.error ? "Tasks couldn't be loaded right now." : "No open tasks yet. Be the first to post one."}
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="page-container pt-20 sm:pt-28">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-4xl">How it works</h2>
          <p className="text-muted mt-2">Four steps from idea to approved delivery. Freelancers follow the same path from the other side.</p>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card card-pad">
              <div className="flex items-center gap-3 mb-4">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-soft text-primary"><Icon size={19} aria-hidden="true" /></span>
                <span className="text-sm text-faint font-semibold">Step {i + 1}</span>
              </div>
              <h3 className="text-lg">{title}</h3>
              <p className="text-muted mt-1.5">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      <section className="page-container pt-20 sm:pt-28">
        <h2 className="text-2xl sm:text-4xl mb-8">Find work by category</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(({ name, icon: Icon }) => (
            <Link key={name} to={`/tasks?category=${encodeURIComponent(name)}`} className="card card-hover flex items-center gap-3 p-4 min-w-0">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-surface-2 text-primary shrink-0"><Icon size={18} aria-hidden="true" /></span>
              <span className="font-medium leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Audiences */}
      <section className="page-container pt-20 sm:pt-28 grid gap-4 md:grid-cols-2">
        {[
          { title: "For clients", points: ["Post tasks in a couple of minutes", "Compare price, timeline and pitch side by side", "Request changes before you approve", "Track every task from your dashboard"], cta: "Start hiring", to: "/register" },
          { title: "For freelancers", points: ["Browse open tasks and filter by category and budget", "Send a proposal with your own price", "Deliver work and get approved in one place", "See earnings, win rate and active jobs at a glance"], cta: "Start earning", to: "/register" },
        ].map((a) => (
          <div key={a.title} className="card card-pad !p-6 sm:!p-8 flex flex-col">
            <h3 className="text-2xl">{a.title}</h3>
            <ul className="mt-5 space-y-3 list-none p-0 m-0 flex-1">
              {a.points.map((p) => (
                <li key={p} className="flex gap-3"><LuCheck size={18} className="text-success mt-0.5 shrink-0" aria-hidden="true" /><span>{p}</span></li>
              ))}
            </ul>
            {!profile && <Link to={a.to} className="btn btn-outline mt-7 self-start">{a.cta}</Link>}
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section id="faq" className="page-container pt-20 sm:pt-28">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl mb-8 text-center">Frequently asked questions</h2>
          <div className="card divide-y divide-line">
            {FAQ.map(([q, a], i) => (
              <details key={q} className="group px-5 py-4" open={i === 0}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer font-semibold list-none [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-faint transition-transform group-open:rotate-45 text-xl leading-none" aria-hidden="true">+</span>
                </summary>
                <p className="text-muted mt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!profile && (
        <section className="page-container pt-20 sm:pt-28">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center" style={{ background: "var(--primary)", color: "var(--on-primary)" }}>
            <h2 className="text-2xl sm:text-4xl max-w-2xl mx-auto">Ready to get your next task done?</h2>
            <p className="mt-3 opacity-90 max-w-xl mx-auto">Create your account in under a minute and choose whether you're hiring or looking for work.</p>
            <Link to="/register" className="btn btn-lg mt-7" style={{ background: "var(--surface)", color: "var(--text)" }}>Create free account</Link>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
