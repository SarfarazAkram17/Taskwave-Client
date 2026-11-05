import { Link, Outlet } from "react-router";
import Logo from "../Components/ui/Logo";
import ThemeToggle from "../Components/ui/ThemeToggle";
import { Wave } from "../Components/Wave";
import NavProgress from "../Components/ui/NavProgress";

const AuthLayout = () => (
  <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
    <NavProgress />
    <div className="flex flex-col min-h-screen">
      <div className="h-16 px-4 sm:px-8 flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
      <main id="main" className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md"><Outlet /></div>
      </main>
      <p className="px-4 sm:px-8 py-5 text-sm text-faint text-center">
        <Link to="/" className="hover:text-ink">Back to website</Link>
      </p>
    </div>
    <aside className="hidden lg:flex relative overflow-hidden items-end p-12 bg-surface-2 border-l border-line" aria-hidden="true">
      <Wave className="absolute inset-x-0 bottom-0 h-3/4" />
      <div className="relative max-w-md">
        <h2 className="text-4xl leading-tight">Work that moves from brief to delivered, without the back-and-forth.</h2>
        <p className="text-muted mt-4">Clients post tasks and pick the best proposal. Freelancers deliver and get approved. Every step is tracked.</p>
      </div>
    </aside>
  </div>
);

export default AuthLayout;
