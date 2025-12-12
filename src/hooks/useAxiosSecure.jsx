// src/hooks/useAxiosSecure.js
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request Interceptor - Add JWT token to every request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        // Get fresh token from Firebase
        if (user) {
          try {
            const token = await user.getIdToken(true); // Force refresh
            config.headers.authorization = `Bearer ${token}`;
          } catch (error) {
            console.error("Error getting token:", error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle 401/403 errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response?.status;

        // If unauthorized or forbidden, logout and redirect
        if (status === 401 || status === 403) {
          await signOutUser();
          navigate("/login", { replace: true });
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
