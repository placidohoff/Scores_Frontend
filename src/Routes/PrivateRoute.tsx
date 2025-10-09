
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/auth";

const PrivateRoute = () => {
  const {auth} = useAuth();

  console.log(auth, "CHECKING CREDS")

  // If no token, redirect to login
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render children (nested routes)
  return <Outlet />;
};

export default PrivateRoute;
