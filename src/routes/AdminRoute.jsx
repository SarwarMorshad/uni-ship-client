// src/routes/AdminRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useCheckAdmin } from "../hooks/useUser";
import LoadingSpinner from "../shared/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: adminData, isLoading } = useCheckAdmin(user?.email);

  // Show loading spinner while checking authentication
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to user dashboard if not admin
  if (!adminData?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin, render children
  return children;
};

export default AdminRoute;
