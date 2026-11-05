import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { LuLogOut } from "react-icons/lu";
import { toast } from "react-toastify";
import { useAuth } from "../../Authentication/useAuth";
import { ROLE_LABEL } from "../../lib/constants";
import { navFor } from "../../lib/navigation";
import Avatar from "./Avatar";

const UserMenu = () => {
  const { user, profile, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const name = profile?.name || user?.displayName || user?.email;
  const photo = profile?.photo || user?.photoURL;
  const items = profile ? navFor(profile.role) : [];

  const logout = async () => {
    setOpen(false);
    await logoutUser();
    toast.info("You've been logged out");
    navigate("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full p-0.5 border border-transparent hover:border-line-strong"
      >
        <Avatar name={name} src={photo} size={34} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] card !rounded-xl shadow-lg p-2 z-50 pop-in max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <div className="flex items-center gap-3 px-2 py-2.5 border-b border-line mb-1">
            <Avatar name={name} src={photo} size={40} />
            <div className="min-w-0">
              <p className="font-semibold truncate">{name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
              {profile && (
                <span className="badge badge-info badge-plain mt-1">
                  {ROLE_LABEL[profile.role]}
                </span>
              )}
            </div>
          </div>
          {items.length > 0 && (
            <div className="flex flex-col gap-0.5 pb-1 mb-1 border-b border-line">
              {items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  role="menuitem"
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `nav-link w-full ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>
          )}
          <button
            role="menuitem"
            type="button"
            onClick={logout}
            className="nav-link w-full text-left"
          >
            <LuLogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;