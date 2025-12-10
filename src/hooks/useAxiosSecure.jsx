import axios from "axios";

import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //   Request Interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (user?.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    // Response Interceptor
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        if ((err.response && err.response.status === 401) || err.response.status === 403) {
          signOutUser().then(() => {
            //   navigate to login page
            navigate("/register");
          });
        }
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
