// src/hooks/usePayment.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stripeService } from "../services/stripeService";
import toast from "react-hot-toast";
import { parcelKeys } from "./useParcel";

// Create Stripe Checkout Session
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: ({ parcelId, amount, parcelName }) =>
      stripeService.createCheckoutSession(parcelId, amount, parcelName),
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
      // Invalidate all parcel queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: parcelKeys.all,
      });
      toast.success("Payment successful! 🎉");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Payment verification failed";
      toast.error(errorMessage);
    },
  });
};
