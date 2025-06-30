import { createBrowserRouter } from "react-router";
import MainLayout from "../MainLayout/MainLayout";
import PrivateRoutes from "./PrivateRoutes";
import BrowseTasks from "../Pages/BrowseTasks/BrowseTasks";
import MyPostedTasks from "../Pages/MyPostedTasks/MyPostedTasks";
import AddTask from "../Pages/AddTask/AddTask";
import TaskDetails from "../Pages/TaskDetails/TaskDetails";
import UpdateTask from "../Pages/UpdateTask/UpdateTask";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("../Pages/Home/Home"));
const Login = lazy(() => import("../Pages/Login/Login"));
const Register = lazy(() => import("../Pages/Register/Register"));
const ErrorPage = lazy(() => import("../Components/ErrorPage/ErrorPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center h-[50vh] items-center">
                <span className="loading loading-bars loading-xl"></span>
              </div>
            }
          >
            <Home></Home>
          </Suspense>
        ),
      },
      {
        path: "/addTask",
        element: (
          <PrivateRoutes>
            <AddTask></AddTask>
          </PrivateRoutes>
        ),
      },
      {
        path: "/browseTasks",
        loader: () =>
          fetch("https://assignment-10-sarfaraz-akram.vercel.app/tasks"),
        Component: BrowseTasks,
        hydrateFallbackElement: (
          <div className="flex justify-center h-[50vh] items-center">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        ),
      },
      {
        path: "/taskDetails/:id",
        loader: ({ params }) =>
          fetch(
            `https://assignment-10-sarfaraz-akram.vercel.app/tasks/${params.id}`
          ),
        element: (
          <PrivateRoutes>
            <TaskDetails></TaskDetails>
          </PrivateRoutes>
        ),
        hydrateFallbackElement: (
          <div className="flex justify-center h-[50vh] items-center">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        ),
      },
      {
        path: "/myPostedTasks",
        element: (
          <PrivateRoutes>
            <MyPostedTasks></MyPostedTasks>
          </PrivateRoutes>
        ),
      },
      {
        path: "/updateTask/:id",
        loader: ({ params }) =>
          fetch(
            `https://assignment-10-sarfaraz-akram.vercel.app/tasks/${params.id}`
          ),
        element: (
          <PrivateRoutes>
            <UpdateTask></UpdateTask>
          </PrivateRoutes>
        ),
        hydrateFallbackElement: (
          <div className="flex justify-center h-[50vh] items-center">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center h-[50vh] items-center">
                <span className="loading loading-bars loading-xl"></span>
              </div>
            }
          >
            <Login></Login>
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense
            fallback={
              <div className="flex justify-center h-[50vh] items-center">
                <span className="loading loading-bars loading-xl"></span>
              </div>
            }
          >
            <Register></Register>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense
        fallback={
          <div className="flex justify-center h-[100vh] items-center">
            <span className="loading loading-bars loading-xl"></span>
          </div>
        }
      >
        <ErrorPage></ErrorPage>
      </Suspense>
    ),
  },
]);
