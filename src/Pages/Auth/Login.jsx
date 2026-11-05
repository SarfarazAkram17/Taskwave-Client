import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../Authentication/useAuth";
import Field from "../../Components/ui/Field";
import { Divider, GoogleButton, PasswordInput } from "./authShared";
import { authError } from "./authErrors";

const Login = () => {
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const afterLogin = () => { toast.success("Welcome back"); navigate(from || "/dashboard", { replace: true }); };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email").trim(), password = fd.get("password");
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await loginUser(email, password); afterLogin(); }
    catch (err) { const m = authError(err); if (m) toast.error(m); }
    finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    try { await googleLogin(); afterLogin(); }
    catch (err) { const m = authError(err); if (m) toast.error(m); }
    finally { setBusy(false); }
  };

  return (
    <div className="pop-in">
      <h1 className="text-3xl">Welcome back</h1>
      <p className="text-muted mt-2 mb-7">Log in to manage your tasks, proposals and jobs.</p>
      <GoogleButton onClick={google} busy={busy} />
      <Divider>or log in with email</Divider>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email" error={errors.email}>
          {(p) => <input {...p} className="input" type="email" name="email" autoComplete="email" placeholder="you@example.com" />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(p) => <PasswordInput {...p} name="password" autoComplete="current-password" placeholder="Your password" />}
        </Field>
        <button className="btn btn-primary btn-block !min-h-11" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="text-sm text-muted mt-6 text-center">
        New to TaskWave? <Link to="/register" state={location.state} className="text-primary font-semibold hover:underline">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
