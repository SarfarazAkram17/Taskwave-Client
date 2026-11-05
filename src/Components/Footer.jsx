import { Link } from "react-router";
import Logo from "./ui/Logo";

const Footer = () => (
  <footer className="border-t border-line bg-surface mt-16">
    <div className="page-container py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="sm:col-span-2 lg:col-span-1">
        <Logo />
        <p className="text-muted mt-4 max-w-xs">Post a task, compare proposals, and get quality work delivered, all in one place.</p>
      </div>
      <div>
        <h3 className="text-sm mb-3">For clients</h3>
        <ul className="space-y-2 text-muted list-none p-0 m-0">
          <li><Link className="hover:text-ink" to="/register">Post a task</Link></li>
          <li><Link className="hover:text-ink" to="/tasks">Browse tasks</Link></li>
          <li><Link className="hover:text-ink" to="/#how-it-works">How it works</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm mb-3">For freelancers</h3>
        <ul className="space-y-2 text-muted list-none p-0 m-0">
          <li><Link className="hover:text-ink" to="/register">Join as a freelancer</Link></li>
          <li><Link className="hover:text-ink" to="/tasks">Find work</Link></li>
          <li><Link className="hover:text-ink" to="/#faq">FAQ</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-sm mb-3">Support</h3>
        <ul className="space-y-2 text-muted list-none p-0 m-0">
          <li><a className="hover:text-ink" href="mailto:support@taskwave.com">support@taskwave.com</a></li>
          <li><Link className="hover:text-ink" to="/login">Log in</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-line">
      <div className="page-container py-5 text-sm text-faint flex flex-col sm:flex-row justify-between gap-1">
        <p>© {new Date().getFullYear()} TaskWave. All rights reserved.</p>
        <p>Built for clients and freelancers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
