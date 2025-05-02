import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Loader />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to={`/login?redirectUrl=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
