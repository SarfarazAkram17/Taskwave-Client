import {
  LuBriefcase,
  LuClipboardList,
  LuFilePlus2,
  LuLayoutDashboard,
  LuListChecks,
  LuSearch,
  LuSend,
  LuUserRound,
  LuUsers,
} from "react-icons/lu";

/** Single source of truth for role-based dashboard links (sidebar AND profile dropdown). */
const NAV = {
  client: [
    { to: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
    { to: "/dashboard/post-task", label: "Post a task", icon: LuFilePlus2 },
    { to: "/dashboard/my-tasks", label: "My tasks", icon: LuClipboardList },
    { to: "/tasks", label: "Browse marketplace", icon: LuSearch },
  ],
  freelancer: [
    { to: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
    { to: "/tasks", label: "Find work", icon: LuSearch },
    { to: "/dashboard/proposals", label: "My proposals", icon: LuSend },
    { to: "/dashboard/jobs", label: "My jobs", icon: LuBriefcase },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, end: true },
    { to: "/dashboard/users", label: "Users", icon: LuUsers },
    { to: "/dashboard/tasks", label: "All tasks", icon: LuListChecks },
    { to: "/tasks", label: "Marketplace", icon: LuSearch },
  ],
};

export const navFor = (role) => [
  ...(NAV[role] || []),
  { to: "/dashboard/profile", label: "Profile", icon: LuUserRound },
];