// src/components/Routes/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/auth";
import jwtDecode from "jwt-decode";
import { IJwtPayload } from "../Interfaces/IJwtPayload";

const AdminRoute = () => {
  const { auth } = useAuth();

  if (!auth?.token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode<IJwtPayload>(auth.token);
    const role = decoded.role;

    if (role !== "admin") {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;
