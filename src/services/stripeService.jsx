// src/services/stripeService.js
import axios from "axios";

const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const stripeService = {
  // Create Stripe Checkout Session
  createCheckoutSession: async (parcelId, amount, parcelName) => {
    const response = await axiosInstance.post("/create-checkout-session", {
      parcelId,
      amount,
      parcelName,
    });
    return response.data;
  },

  // Verify payment after redirect
  verifyPayment: async (sessionId, parcelId) => {
    const response = await axiosInstance.post("/verify-payment", {
      sessionId,
      parcelId,
    });
    return response.data;
  },
};
