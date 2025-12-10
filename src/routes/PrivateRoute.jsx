import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (user) {
    return children;
  }
  // Show toast when redirecting to login
  toast.error("Please login to access this page", { duration: 3000 });

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
