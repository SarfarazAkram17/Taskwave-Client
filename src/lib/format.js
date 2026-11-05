const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdExact = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const money = (n) => (Number.isInteger(Number(n)) ? usd : usdExact).format(Number(n) || 0);

export const compactMoney = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `$${v}`;
};

const parse = (d) => (d instanceof Date ? d : new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d));

export const formatDate = (d) => {
  if (!d) return "-";
  const date = parse(d);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/** Deadline → { text, tone } relative to today. */
export const deadlineInfo = (deadline) => {
  const date = parse(deadline);
  if (Number.isNaN(date.getTime())) return { text: "-", tone: "muted" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((date - today) / 86400000);
  if (days < 0) return { text: `${-days}d overdue`, tone: "danger" };
  if (days === 0) return { text: "Due today", tone: "warning" };
  if (days === 1) return { text: "Due tomorrow", tone: "warning" };
  if (days <= 7) return { text: `${days} days left`, tone: "warning" };
  return { text: `${days} days left`, tone: "muted" };
};

export const timeAgo = (d) => {
  if (!d) return "";
  const s = Math.round((Date.now() - parse(d).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
};

export const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";

export const todayISO = () => new Date().toLocaleDateString("en-CA");
