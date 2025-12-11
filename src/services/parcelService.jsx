// src/services/parcelService.js
import axios from "axios";

const API_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Parcel API calls
export const parcelService = {
  // Get all parcels for a user
  getUserParcels: async (email) => {
    const response = await axiosInstance.get(`/parcels/user/${email}`);
    return response.data;
  },

  // Get unpaid parcels for a user
  getUnpaidParcels: async (email) => {
    const response = await axiosInstance.get(`/parcels/user/${email}/unpaid`);
    return response.data;
  },

  // Get single parcel by ID
  getParcelById: async (id) => {
    const response = await axiosInstance.get(`/parcels/${id}`);
    return response.data;
  },

  // Create new parcel
  createParcel: async (parcelData) => {
    const response = await axiosInstance.post("/parcels", parcelData);
    return response.data;
  },

  // Delete parcel
  deleteParcel: async (id) => {
    const response = await axiosInstance.delete(`/parcels/${id}`);
    return response.data;
  },

  // Search parcels by phone
  searchParcelsByPhone: async (phone, email) => {
    const response = await axiosInstance.get(`/parcels/search/phone/${phone}`, {
      params: { email },
    });
    return response.data;
  },

  // Get all parcels (admin)
  getAllParcels: async () => {
    const response = await axiosInstance.get("/parcels");
    return response.data;
  },
};

export default axiosInstance;
