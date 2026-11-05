import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const nums = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) nums.push(p);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }
  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap mt-8" aria-label="Pagination">
      <button className="btn btn-outline btn-sm btn-icon" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <LuChevronLeft size={16} />
      </button>
      {nums.map((n, i) =>
        n === "…" ? (
          <span key={`g${i}`} className="px-1 text-faint" aria-hidden="true">…</span>
        ) : (
          <button key={n} onClick={() => onChange(n)} aria-current={n === page ? "page" : undefined}
            className={`btn btn-sm btn-icon ${n === page ? "btn-primary" : "btn-ghost"}`}>
            {n}
          </button>
        )
      )}
      <button className="btn btn-outline btn-sm btn-icon" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <LuChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
