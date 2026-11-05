import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../Authentication/useAuth";
import { PageLoader } from "../../Components/ui/Feedback";
import { RolePicker } from "./authShared";

/** Shown to people who signed in (e.g. with Google) but haven't chosen a role yet. */
const Onboarding = () => {
  const { user, profile, loading, registerProfile, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("client");
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoader label="Loading" />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile) return <Navigate to="/dashboard" replace />;

  const submit = async () => {
    setBusy(true);
    try {
      await registerProfile({ role, name: user.displayName || undefined });
      toast.success("You're all set");
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pop-in">
      <h1 className="text-3xl">One last step</h1>
      <p className="text-muted mt-2 mb-6">
        Welcome{user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}.
        Tell us how you'll use TaskWave so we can set up the right dashboard.
      </p>
      <RolePicker value={role} onChange={setRole} />
      <button
        className="btn btn-primary btn-block !min-h-11 mt-6"
        onClick={submit}
        disabled={busy}
      >
        {busy ? "Setting up…" : "Continue"}
      </button>
      <button
        className="btn btn-ghost btn-block mt-2"
        onClick={() => logoutUser()}
      >
        Use a different account
      </button>
    </div>
  );
};

export default Onboarding;