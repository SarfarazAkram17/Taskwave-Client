import { createBrowserRouter, Navigate, useParams } from "react-router";
import PublicLayout from "../Layouts/PublicLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import AuthLayout from "../Layouts/AuthLayout";
import ErrorPage from "../Components/ErrorPage";
import { GuestOnly, RequireAuth, RequireRole } from "./Guards";

const page = (loader) => ({ lazy: async () => ({ Component: (await loader()).default }) });
const role = (roles, loader) => ({
  lazy: async () => {
    const Page = (await loader()).default;
    return { Component: () => <RequireRole roles={roles}><Page /></RequireRole> };
  },
});

// Links from the previous version of the site keep working.
const Redirect = ({ to }) => {
  const params = useParams();
  return <Navigate replace to={to.replace(":id", params.id || "")} />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, ...page(() => import("../Pages/Home/Home")) },
      { path: "tasks", ...page(() => import("../Pages/Browse/BrowseTasks")) },
      { path: "tasks/:id", ...page(() => import("../Pages/TaskDetails/TaskDetails")) },
      { path: "browseTasks", element: <Redirect to="/tasks" /> },
      { path: "taskDetails/:id", element: <Redirect to="/tasks/:id" /> },
      { path: "addTask", element: <Redirect to="/dashboard/post-task" /> },
      { path: "myPostedTasks", element: <Redirect to="/dashboard/my-tasks" /> },
      { path: "updateTask/:id", element: <Redirect to="/dashboard/edit-task/:id" /> },
      { path: "*", Component: ErrorPage },
    ],
  },
  {
    Component: AuthLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { path: "login", lazy: async () => { const P = (await import("../Pages/Auth/Login")).default; return { Component: () => <GuestOnly><P /></GuestOnly> }; } },
      { path: "register", lazy: async () => { const P = (await import("../Pages/Auth/Register")).default; return { Component: () => <GuestOnly><P /></GuestOnly> }; } },
      { path: "onboarding", ...page(() => import("../Pages/Auth/Onboarding")) },
    ],
  },
  {
    path: "/dashboard",
    ErrorBoundary: ErrorPage,
    element: <RequireAuth><DashboardLayout /></RequireAuth>,
    children: [
      { index: true, ...page(() => import("../Pages/Dashboard/Overview")) },
      { path: "profile", ...page(() => import("../Pages/Dashboard/Profile")) },
      { path: "tasks/:id", ...page(() => import("../Pages/Dashboard/TaskWorkspace")) },
      // client
      { path: "post-task", ...role(["client", "admin"], () => import("../Pages/Dashboard/TaskForm")) },
      { path: "edit-task/:id", ...role(["client", "admin"], () => import("../Pages/Dashboard/TaskForm")) },
      { path: "my-tasks", ...role(["client"], () => import("../Pages/Dashboard/MyTasks")) },
      // freelancer
      { path: "proposals", ...role(["freelancer"], () => import("../Pages/Dashboard/MyProposals")) },
      { path: "jobs", ...role(["freelancer"], () => import("../Pages/Dashboard/MyJobs")) },
      // admin
      { path: "users", ...role(["admin"], () => import("../Pages/Dashboard/AdminUsers")) },
      { path: "tasks", ...role(["admin"], () => import("../Pages/Dashboard/AdminTasks")) },
      { path: "*", Component: ErrorPage },
    ],
  },
  { path: "*", Component: ErrorPage },
]);
