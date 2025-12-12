// src/hooks/usePayment.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stripeService } from "../services/stripeService";
import axios from "axios";
import toast from "react-hot-toast";
import { parcelKeys } from "./useParcel";

const API_URL = "http://localhost:3000";

// Payment query keys
export const paymentKeys = {
  all: ["payments"],
  user: (email) => ["payments", "user", email],
  detail: (id) => ["payments", id],
};

// Create Stripe Checkout Session
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: ({ parcelId, amount, parcelName, customerEmail }) =>
      stripeService.createCheckoutSession(parcelId, amount, parcelName, customerEmail),
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to create checkout session";
      toast.error(errorMessage);
    },
  });
};

// Verify payment after Stripe redirect
export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, parcelId }) => stripeService.verifyPayment(sessionId, parcelId),
    onSuccess: () => {
      // Invalidate all parcel and payment queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: parcelKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });
      toast.success("Payment successful! 🎉");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Payment verification failed";
      toast.error(errorMessage);
    },
  });
};

// Get user's payment history
export const usePaymentHistory = (email) => {
  return useQuery({
    queryKey: paymentKeys.user(email),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/payments/user/${email}`);
      return response.data;
    },
    enabled: !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
