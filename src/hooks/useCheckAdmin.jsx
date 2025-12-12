// src/hooks/useCheckAdmin.jsx
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useCheckAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        setIsAdminLoading(false);
        return;
      }

      try {
        // Get user data from database to check role
        const response = await axiosSecure.get(`/users/${user.email}`);
        const userData = response.data;

        // Check if user has admin role
        setIsAdmin(userData?.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user?.email, authLoading, axiosSecure]);

  return { isAdmin, isAdminLoading };
};

export default useCheckAdmin;
