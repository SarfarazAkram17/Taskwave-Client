import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { LuMenu, LuX, LuShieldCheck, LuArrowLeft } from "react-icons/lu";
import { useAuth } from "../Authentication/useAuth";
import { ROLE_LABEL } from "../lib/constants";
import { navFor } from "../lib/navigation";
import Logo from "../Components/ui/Logo";
import ThemeToggle from "../Components/ui/ThemeToggle";
import UserMenu from "../Components/ui/UserMenu";
import NavProgress from "../Components/ui/NavProgress";

const DashboardLayout = () => {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const items = navFor(profile.role);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b border-line shrink-0">
        <Logo to="/dashboard" />
        <button
          type="button"
          className="btn btn-ghost btn-icon btn-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <LuX size={18} />
        </button>
      </div>
      <div className="px-5 pt-5 pb-2">
        <span className="badge badge-info badge-plain">
          {profile.role === "admin" && <LuShieldCheck size={13} />}
          {ROLE_LABEL[profile.role]} workspace
        </span>
      </div>
      <nav
        className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1"
        aria-label="Dashboard"
      >
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-line shrink-0">
        <Link to="/" className="nav-link w-full">
          <LuArrowLeft size={16} />
          Back to website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <NavProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] btn btn-primary"
      >
        Skip to content
      </a>
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-surface border-r border-line z-30">
        {sidebar}
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-surface border-r border-line shadow-lg pop-in"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard menu"
          >
            {sidebar}
          </aside>
        </div>
      )}
      <div className="lg:pl-64 min-w-0">
        <header
          className="sticky top-0 z-20 h-16 border-b border-line backdrop-blur-md flex items-center"
          style={{
            background: "color-mix(in srgb, var(--bg) 85%, transparent)",
          }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            <button
              type="button"
              className="btn btn-ghost btn-icon lg:hidden -ml-2"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <LuMenu size={20} />
            </button>
            <p className="hidden lg:block text-muted text-sm">
              Hi,{" "}
              <strong className="text-ink">
                {profile.name?.split(" ")[0]}
              </strong>
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </header>
        <main
          id="main"
          className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[88rem]"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;