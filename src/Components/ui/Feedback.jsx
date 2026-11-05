import { LuInbox, LuTriangleAlert } from "react-icons/lu";

export const Spinner = ({ className = "" }) => <span className={`spinner inline-block ${className}`} role="status" aria-label="Loading" />;

export const PageLoader = ({ label = "Loading", className = "min-h-[40vh]" }) => (
  <div className={`flex flex-col items-center justify-center gap-3 text-muted ${className}`}>
    <Spinner className="!w-7 !h-7" />
    <span className="text-sm">{label}…</span>
  </div>
);

export const EmptyState = ({ icon: Icon = LuInbox, title, children, action }) => (
  <div className="flex flex-col items-center text-center py-12 px-4">
    <span className="grid place-items-center w-12 h-12 rounded-full bg-surface-2 text-muted mb-4">
      <Icon size={22} aria-hidden="true" />
    </span>
    <h3 className="text-lg">{title}</h3>
    {children && <p className="text-muted mt-1.5 max-w-sm">{children}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="flex flex-col items-center text-center py-12 px-4" role="alert">
    <span className="grid place-items-center w-12 h-12 rounded-full bg-danger-soft text-danger mb-4">
      <LuTriangleAlert size={22} aria-hidden="true" />
    </span>
    <h3 className="text-lg">We couldn't load this</h3>
    <p className="text-muted mt-1.5 max-w-sm">{error?.message || "Something went wrong. Please try again."}</p>
    {onRetry && <button className="btn btn-outline mt-5" onClick={onRetry}>Try again</button>}
  </div>
);

export const Skeleton = ({ className = "" }) => <div className={`skeleton ${className}`} aria-hidden="true" />;

export const CardSkeletons = ({ count = 6 }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card card-pad space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    ))}
  </>
);
