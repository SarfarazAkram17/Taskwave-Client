import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Authentication/AuthContext";

const PrivateRouter = ({ children }) => {
  const location = useLocation()
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center h-[50vh] items-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRouter;
