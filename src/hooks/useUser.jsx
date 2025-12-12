// src/hooks/useUser.js - UPDATED with Secure Axios
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000";

// Query keys
export const userKeys = {
  all: ["users"],
  byEmail: (email) => ["users", email],
  stats: ["users", "stats"],
};

// ==========================================
// PUBLIC ENDPOINTS (No Auth Required)
// ==========================================

// Create user in database (after Firebase registration)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, displayName, photoURL }) => {
      const response = await axios.post(`${API_URL}/users`, {
        email,
        displayName,
        photoURL,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.byEmail(data.user.email) });
      console.log("✅ User saved to database:", data.user);
    },
    onError: (error) => {
      console.error("❌ Error saving user to database:", error);
    },
  });
};

// ==========================================
// PROTECTED ENDPOINTS (Auth Required)
// ==========================================

// Get user by email (requires auth)
export const useUserData = (email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: userKeys.byEmail(email),
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Check if user is admin (requires auth)
export const useCheckAdmin = (email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["admin-check", email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${email}/check-admin`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==========================================
// ADMIN ENDPOINTS (Admin Auth Required)
// ==========================================

// Get all users (admin only)
export const useAllUsers = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/users");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update user role (admin only)
export const useUpdateUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }) => {
      const response = await axiosSecure.patch(`/users/${email}/role`, { role });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.byEmail(variables.email) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user role");
    },
  });
};

// Update user status (admin only)
export const useUpdateUserStatus = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, status }) => {
      const response = await axiosSecure.patch(`/users/${email}/status`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.byEmail(variables.email) });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });
};

// Delete user (admin only)
export const useDeleteUser = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email) => {
      const response = await axiosSecure.delete(`/users/${email}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};

// Get user statistics (admin only)
export const useUserStats = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: userKeys.stats,
    queryFn: async () => {
      const response = await axiosSecure.get("/users/stats/overview");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
