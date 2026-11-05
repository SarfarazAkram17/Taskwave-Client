import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { LuCompass } from "react-icons/lu";

const ErrorPage = () => {
  const error = useRouteError();
  const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);
  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-16 text-center">
      <div className="max-w-md">
        <span className="grid place-items-center w-14 h-14 rounded-2xl bg-primary-soft text-primary mx-auto mb-6"><LuCompass size={26} /></span>
        <p className="font-display text-6xl font-bold text-primary">{notFound ? "404" : "Oops"}</p>
        <h1 className="text-2xl mt-3">{notFound ? "This page drifted away" : "Something went wrong"}</h1>
        <p className="text-muted mt-2">
          {notFound ? "The page you're looking for doesn't exist or has moved." : "An unexpected error occurred. Reloading usually fixes it."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-7">
          <Link to="/" className="btn btn-primary">Go home</Link>
          {notFound ? <Link to="/tasks" className="btn btn-outline">Browse tasks</Link> : <button className="btn btn-outline" onClick={() => window.location.reload()}>Reload page</button>}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
