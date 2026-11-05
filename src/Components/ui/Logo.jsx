import { Link } from "react-router";

export const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
    <defs>
      <linearGradient id="tw-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b5bff" />
        <stop offset="1" stopColor="#12b5b0" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#tw-g)" />
    <path d="M10 38c6-12 12-12 18 0s12 12 18 0 6-6 8-8" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Logo = ({ to = "/", size = 32, className = "" }) => (
  <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="TaskWave home">
    <LogoMark size={size} />
    <span className="font-display text-xl font-bold tracking-tight">TaskWave</span>
  </Link>
);

export default Logo;
