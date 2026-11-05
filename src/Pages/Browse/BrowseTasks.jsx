import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { LuSearch, LuSlidersHorizontal, LuX, LuSearchX } from "react-icons/lu";
import { api } from "../../lib/api";
import { useAsync, useDebounced } from "../../lib/useAsync";
import { CATEGORY_NAMES, SORT_OPTIONS } from "../../lib/constants";
import TaskCard from "../../Components/TaskCard";
import Pagination from "../../Components/ui/Pagination";
import { CardSkeletons, EmptyState, ErrorState } from "../../Components/ui/Feedback";

const BrowseTasks = () => {
  const [params, setParams] = useSearchParams();
  const get = (k, d = "") => params.get(k) || d;
  const [q, setQ] = useState(get("q"));
  const debounced = useDebounced(q);
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === "" || v == null ? next.delete(k) : next.set(k, v)));
    if (!("page" in patch)) next.delete("page");
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (debounced !== get("q")) update({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const query = {
    q: get("q"), category: get("category"), sort: get("sort", "newest"),
    minBudget: get("minBudget"), maxBudget: get("maxBudget"), page: get("page", "1"), limit: 9,
  };
  const key = JSON.stringify(query);
  const { data, error, loading, reload } = useAsync(() => api.get("/tasks", query), [key]);

  const activeCount = ["category", "minBudget", "maxBudget"].filter((k) => get(k)).length;
  const hasFilters = activeCount > 0 || get("q");
  const clear = () => { setQ(""); setParams({}, { replace: true }); };

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl">Browse tasks</h1>
        <p className="text-muted mt-2">Find an open task that fits your skills and send a proposal.</p>
      </div>

      <div className="card card-pad !p-3 sm:!p-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none" size={18} aria-hidden="true" />
            <input className="input !pl-10" type="search" placeholder="Search tasks" aria-label="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <button type="button" className="btn btn-outline lg:hidden" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="filters">
            <LuSlidersHorizontal size={16} /><span className="hidden xs:inline">Filters</span>{activeCount > 0 && <span className="badge badge-info badge-plain !px-1.5">{activeCount}</span>}
          </button>
        </div>
        <div id="filters" className={`${showFilters ? "grid" : "hidden"} lg:grid gap-3 mt-3 grid-cols-1 xs:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.7fr_0.7fr]`}>
          <div>
            <label className="label" htmlFor="f-cat">Category</label>
            <select id="f-cat" className="select" value={get("category")} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All categories</option>
              {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-sort">Sort by</label>
            <select id="f-sort" className="select" value={get("sort", "newest")} onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="f-min">Min budget ($)</label>
            <input id="f-min" className="input" type="number" min="0" inputMode="numeric" placeholder="0" value={get("minBudget")} onChange={(e) => update({ minBudget: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="f-max">Max budget ($)</label>
            <input id="f-max" className="input" type="number" min="0" inputMode="numeric" placeholder="Any" value={get("maxBudget")} onChange={(e) => update({ maxBudget: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4 min-h-8" aria-live="polite">
        <p className="text-sm text-muted">{data ? <><strong className="text-ink">{data.total}</strong> {data.total === 1 ? "task" : "tasks"} found</> : "Loading tasks…"}</p>
        {hasFilters && <button className="btn btn-ghost btn-sm" onClick={clear}><LuX size={14} />Clear filters</button>}
      </div>

      {error && !data ? (
        <div className="card"><ErrorState error={error} onRetry={reload} /></div>
      ) : loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><CardSkeletons count={6} /></div>
      ) : data.items.length === 0 ? (
        <div className="card">
          <EmptyState icon={LuSearchX} title="No tasks match your search"
            action={hasFilters && <button className="btn btn-outline" onClick={clear}>Clear filters</button>}>
            {hasFilters ? "Try a different keyword or widen your filters." : "No open tasks yet. Check back soon."}
          </EmptyState>
        </div>
      ) : (
        <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
          {data.items.map((t) => <TaskCard key={t._id} task={t} />)}
        </div>
      )}
      {data && <Pagination page={data.page} pages={data.pages} onChange={(p) => { update({ page: String(p) }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}
    </div>
  );
};

export default BrowseTasks;
