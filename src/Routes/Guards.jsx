import { Navigate, useLocation } from "react-router";
import { LuShieldAlert } from "react-icons/lu";
import { useAuth } from "../Authentication/useAuth";
import { PageLoader, EmptyState } from "../Components/ui/Feedback";
import { Link } from "react-router";

const FullLoader = () => <PageLoader className="min-h-screen" label="Loading your workspace" />;

/** Signed in AND role chosen. Otherwise send to login / onboarding and remember where they were going. */
export const RequireAuth = ({ children }) => {
  const { user, profile, status, loading, reloadProfile } = useAuth();
  const location = useLocation();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (status === "error") {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <EmptyState icon={LuShieldAlert} title="We couldn't load your account"
          action={<button className="btn btn-primary" onClick={() => reloadProfile().catch(() => {})}>Try again</button>}>
          The server didn't respond. Check your connection and try again.
        </EmptyState>
      </div>
    );
  }
  if (!profile) return <Navigate to="/onboarding" state={{ from: location.pathname + location.search }} replace />;
  return children;
};

export const RequireRole = ({ roles, children }) => {
  const { role } = useAuth();
  if (!roles.includes(role)) {
    return (
      <EmptyState icon={LuShieldAlert} title="This page isn't available for your account"
        action={<Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>}>
        Your {role} account doesn't have access to this section.
      </EmptyState>
    );
  }
  return children;
};

/** Login/register pages: signed-in users go straight to their dashboard. */
export const GuestOnly = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullLoader />;
  if (user && profile) return <Navigate to={location.state?.from || "/dashboard"} replace />;
  return children;
};
