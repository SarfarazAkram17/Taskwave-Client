import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../Authentication/useAuth";
import Field from "../../Components/ui/Field";
import PhotoPicker from "../../Components/ui/PhotoPicker";
import { Divider, GoogleButton, PasswordInput, RolePicker } from "./authShared";
import { authError } from "./authErrors";

const rules = [
  ["At least 6 characters", (p) => p.length >= 6],
  ["One uppercase letter", (p) => /[A-Z]/.test(p)],
  ["One lowercase letter", (p) => /[a-z]/.test(p)],
];

const Register = () => {
  const { signUp, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const [role, setRole] = useState("client");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [nameValue, setNameValue] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Local preview only: the file is uploaded after the account is created.
  useEffect(() => {
    if (!photoFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const done = () => {
    toast.success("Your account is ready");
    navigate(from || "/dashboard", { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name").trim(),
      email = fd.get("email").trim();
    const next = {};
    if (name.length < 2) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      next.email = "Enter a valid email address.";
    if (!rules.every(([, ok]) => ok(password)))
      next.password = "Your password doesn't meet all the requirements below.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const { photoFailed } = await signUp({
        name,
        email,
        password,
        photoFile,
        role,
      });
      if (photoFailed)
        toast.warning(
          "Your account is ready, but the photo couldn't be uploaded. Add it from your profile.",
        );
      done();
    } catch (err) {
      const m = authError(err);
      if (m) toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      await googleLogin(role);
      done();
    } catch (err) {
      const m = authError(err);
      if (m) toast.error(m);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pop-in">
      <h1 className="text-3xl">Create your account</h1>
      <p className="text-muted mt-2 mb-6">
        Free to join. Pick how you'll use TaskWave.
      </p>
      <RolePicker value={role} onChange={setRole} />
      <div className="mt-5">
        <GoogleButton onClick={google} busy={busy} />
      </div>
      <Divider>or sign up with email</Divider>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" error={errors.name}>
          {(p) => (
            <input
              {...p}
              className="input"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
          )}
        </Field>
        <Field label="Email" error={errors.email}>
          {(p) => (
            <input
              {...p}
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}
        </Field>
        <PhotoPicker
          name={nameValue}
          src={preview}
          onSelect={setPhotoFile}
          onRemove={() => setPhotoFile(null)}
        />
        <Field label="Password" error={errors.password}>
          {(p) => (
            <PasswordInput
              {...p}
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </Field>
        <ul
          className="grid gap-1 text-xs list-none p-0 pb-1"
          aria-label="Password requirements"
        >
          {rules.map(([label, ok]) => (
            <li
              key={label}
              className={ok(password) ? "text-success" : "text-muted"}
            >
              {ok(password) ? "✓" : "○"} {label}
            </li>
          ))}
        </ul>
        <button
          className="btn btn-primary btn-block !min-h-11 !mt-5"
          disabled={busy}
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-sm text-muted mt-6 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          state={location.state}
          className="text-primary font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;