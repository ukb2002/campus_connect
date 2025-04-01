
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = () => {
  const { authState } = useAuth();
  const location = useLocation();

  if (authState.isLoading) {
    // You could render a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center bg-campus-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;
