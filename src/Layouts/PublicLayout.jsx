import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { LuMenu, LuX } from "react-icons/lu";
import { useAuth } from "../Authentication/useAuth";
import Logo from "../Components/ui/Logo";
import ThemeToggle from "../Components/ui/ThemeToggle";
import UserMenu from "../Components/ui/UserMenu";
import NavProgress from "../Components/ui/NavProgress";
import Footer from "../Components/Footer";

const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

const PublicLayout = () => {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  const links = (
    <>
      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/tasks" className={linkClass}>Browse tasks</NavLink>
      <Link to="/#how-it-works" className="nav-link">How it works</Link>
      {profile && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavProgress />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] btn btn-primary">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}>
        <div className="page-container h-16 flex items-center justify-between gap-3">
          <Logo />
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">{links}</nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">Log in</Link>
                <Link to="/register" className="btn btn-primary hidden sm:inline-flex">Get started</Link>
              </>
            )}
            <button type="button" className="btn btn-ghost btn-icon md:hidden" onClick={() => setOpen((o) => !o)}
              aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>
              {open ? <LuX size={20} /> : <LuMenu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="md:hidden border-t border-line bg-bg">
            <div className="page-container py-3 flex flex-col gap-1">
              {links}
              {!user && (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-line">
                  <Link to="/login" className="btn btn-outline">Log in</Link>
                  <Link to="/register" className="btn btn-primary">Get started</Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
