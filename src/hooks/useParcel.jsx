// src/hooks/useParcel.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000";

// Query keys
export const parcelKeys = {
  all: ["parcels"],
  user: (email) => ["parcels", "user", email],
  detail: (id) => ["parcels", id],
  track: (trackingNo) => ["parcels", "track", trackingNo],
  unpaid: (email) => ["parcels", "unpaid", email],
};

// ==========================================
// PUBLIC ENDPOINTS (No Auth Required)
// ==========================================

// Track parcel by tracking number (public)
export const useTrackParcel = (trackingNo) => {
  return useQuery({
    queryKey: parcelKeys.track(trackingNo),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parcels/track/${trackingNo}`);
      return response.data;
    },
    enabled: !!trackingNo,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// ==========================================
// PROTECTED ENDPOINTS (Auth Required)
// ==========================================

// Get user's parcels (requires auth)
export const useUserParcels = (email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: parcelKeys.user(email),
    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels/user/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get parcel by ID (requires auth) - THIS IS useParcelDetails
export const useParcelDetails = (id) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: parcelKeys.detail(id),
    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Alternative name for the same hook
export const useParcelById = useParcelDetails;

// Get unpaid parcels (requires auth)
export const useUnpaidParcels = (email) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: parcelKeys.unpaid(email),
    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels/user/${email}`);
      // Filter unpaid parcels from response
      const unpaidParcels = response.data.parcels?.filter((parcel) => parcel.status === "unpaid") || [];
      return { ...response.data, parcels: unpaidParcels };
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  });
};

// Create parcel (requires auth)
export const useCreateParcel = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parcelData) => {
      const response = await axiosSecure.post("/parcels", parcelData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: parcelKeys.all });
      toast.success("Parcel created successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create parcel");
    },
  });
};

// Update parcel (requires auth)
export const useUpdateParcel = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosSecure.put(`/parcels/${id}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: parcelKeys.all });
      queryClient.invalidateQueries({ queryKey: parcelKeys.detail(variables.id) });
      toast.success("Parcel updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update parcel");
    },
  });
};

// Delete parcel (requires auth)
export const useDeleteParcel = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/parcels/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parcelKeys.all });
      toast.success("Parcel deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete parcel");
    },
  });
};

// ==========================================
// ADMIN ENDPOINTS (Admin Auth Required)
// ==========================================

// Get all parcels (admin only)
export const useAllParcels = () => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: parcelKeys.all,
    queryFn: async () => {
      const response = await axiosSecure.get("/parcels");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update parcel status (admin/rider only)
export const useUpdateParcelStatus = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosSecure.patch(`/parcels/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: parcelKeys.all });
      queryClient.invalidateQueries({ queryKey: parcelKeys.detail(variables.id) });
      toast.success("Parcel status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

// Default export for backward compatibility
export default {
  useUserParcels,
  useParcelDetails,
  useParcelById,
  useUnpaidParcels,
  useCreateParcel,
  useUpdateParcel,
  useDeleteParcel,
  useAllParcels,
  useUpdateParcelStatus,
  useTrackParcel,
};
