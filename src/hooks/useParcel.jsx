// src/hooks/useParcel.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parcelService } from "../services/parcelService";
import toast from "react-hot-toast";

// Query Keys
export const parcelKeys = {
  all: ["parcels"],
  user: (email) => ["parcels", "user", email],
  unpaid: (email) => ["parcels", "unpaid", email],
  detail: (id) => ["parcels", "detail", id],
  search: (phone, email) => ["parcels", "search", phone, email],
};

// Get user's parcels
export const useUserParcels = (email) => {
  return useQuery({
    queryKey: parcelKeys.user(email),
    queryFn: () => parcelService.getUserParcels(email),
    enabled: !!email, // Only run if email exists
  });
};

// Get unpaid parcels
export const useUnpaidParcels = (email) => {
  return useQuery({
    queryKey: parcelKeys.unpaid(email),
    queryFn: () => parcelService.getUnpaidParcels(email),
    enabled: !!email,
  });
};

// Get single parcel
export const useParcelDetails = (id) => {
  return useQuery({
    queryKey: parcelKeys.detail(id),
    queryFn: () => parcelService.getParcelById(id),
    enabled: !!id,
  });
};

// Create parcel mutation
export const useCreateParcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: parcelService.createParcel,
    onSuccess: (data, variables) => {
      // Invalidate user parcels query to refetch
      queryClient.invalidateQueries({
        queryKey: parcelKeys.user(variables.senderEmail),
      });
      toast.success("Parcel created successfully! 🎉");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to create parcel";
      toast.error(errorMessage);
    },
  });
};

// Delete parcel mutation
export const useDeleteParcel = (userEmail) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: parcelService.deleteParcel,
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({
        queryKey: parcelKeys.user(userEmail),
      });
      queryClient.invalidateQueries({
        queryKey: parcelKeys.unpaid(userEmail),
      });
      toast.success("Parcel deleted successfully!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to delete parcel";
      toast.error(errorMessage);
    },
  });
};

// Search parcels by phone
export const useSearchParcels = (phone, email) => {
  return useQuery({
    queryKey: parcelKeys.search(phone, email),
    queryFn: () => parcelService.searchParcelsByPhone(phone, email),
    enabled: !!phone && !!email && phone.length >= 11,
  });
};
