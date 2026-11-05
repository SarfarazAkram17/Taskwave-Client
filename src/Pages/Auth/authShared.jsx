import { FcGoogle } from "react-icons/fc";
import { LuBriefcase, LuCheck, LuEye, LuEyeOff, LuUserSearch } from "react-icons/lu";
import { useState } from "react";

export const GoogleButton = ({ onClick, busy, children = "Continue with Google" }) => (
  <button type="button" onClick={onClick} disabled={busy} className="btn btn-outline btn-block !min-h-11">
    <FcGoogle size={20} aria-hidden="true" />{children}
  </button>
);

export const Divider = ({ children = "or" }) => (
  <div className="flex items-center gap-3 my-5 text-xs text-faint" role="separator">
    <span className="flex-1 h-px bg-line" />{children}<span className="flex-1 h-px bg-line" />
  </div>
);

export const PasswordInput = ({ id, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} className="input !pr-11" {...props} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-icon btn-sm">
        {show ? <LuEyeOff size={17} /> : <LuEye size={17} />}
      </button>
    </div>
  );
};

const ROLES = [
  { value: "client", icon: LuBriefcase, title: "I want to hire", text: "Post tasks and choose the best proposal." },
  { value: "freelancer", icon: LuUserSearch, title: "I want to work", text: "Find tasks and send proposals." },
];

export const RolePicker = ({ value, onChange }) => (
  <fieldset className="border-0 p-0 m-0 min-w-0">
    <legend className="label">I want to…</legend>
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
      {ROLES.map(({ value: v, icon: Icon, title, text }) => {
        const on = value === v;
        return (
          <label key={v} className={`relative cursor-pointer rounded-xl border p-3.5 transition-colors ${on ? "border-primary bg-primary-soft" : "border-line-strong hover:border-faint bg-surface"}`}>
            <input type="radio" name="role" value={v} checked={on} onChange={() => onChange(v)} className="sr-only peer" />
            <span className="absolute inset-0 rounded-xl peer-focus-visible:outline-2 peer-focus-visible:outline-primary peer-focus-visible:outline-offset-2" />
            <span className="flex items-center justify-between mb-2">
              <Icon size={20} className={on ? "text-primary" : "text-muted"} aria-hidden="true" />
              {on && <span className="grid place-items-center w-5 h-5 rounded-full bg-primary" style={{ color: "var(--on-primary)" }}><LuCheck size={12} /></span>}
            </span>
            <span className="block font-semibold">{title}</span>
            <span className="block text-xs text-muted mt-0.5">{text}</span>
          </label>
        );
      })}
    </div>
  </fieldset>
);
