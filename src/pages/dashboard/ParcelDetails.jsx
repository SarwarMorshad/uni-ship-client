import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBox,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaHome,
  FaClock,
  FaMoneyBillWave,
  FaWeight,
  FaBarcode,
  FaTruck,
  FaTrash,
} from "react-icons/fa";
import { useParcelDetails, useDeleteParcel } from "../../hooks/useParcel";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../shared/LoadingSpinner";
import StatusBadge from "../../shared/StatusBadge";

const ParcelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch parcel details
  const { data, isLoading, isError, error } = useParcelDetails(id);
  const parcel = data?.parcel;

  // Delete mutation
  const deleteMutation = useDeleteParcel(user?.email);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this parcel?")) {
      try {
        await deleteMutation.mutateAsync(id);
        navigate("/dashboard/my-parcels");
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handlePayNow = () => {
    navigate(`/dashboard/pay/${id}`);
  };

  const handleTrack = () => {
    navigate(`/dashboard/track/${parcel.tracking_no}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 mb-4">Error loading parcel: {error.message}</p>
        <button
          onClick={() => navigate("/dashboard/my-parcels")}
          className="px-6 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg"
        >
          Back to My Parcels
        </button>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 mb-4">Parcel not found</p>
        <button
          onClick={() => navigate("/dashboard/my-parcels")}
          className="px-6 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg"
        >
          Back to My Parcels
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/my-parcels")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parcel Details</h2>
            <p className="text-gray-600 mt-1">View complete parcel information</p>
          </div>
        </div>

        {/* Status Badge */}
        <StatusBadge status={parcel.status} />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaBox className="text-[#caeb66]" />
              Parcel Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Parcel Name</p>
                <p className="font-semibold text-gray-900">{parcel.parcelName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Parcel Type</p>
                <p className="font-semibold text-gray-900 capitalize">{parcel.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Weight</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaWeight className="text-gray-400" />
                  {parcel.weight} KG
                </p>
              </div>
              {parcel.tracking_no && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-semibold text-gray-900 font-mono flex items-center gap-2">
                    <FaBarcode className="text-gray-400" />
                    {parcel.tracking_no}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sender Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Sender Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaUser className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{parcel.senderName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{parcel.senderPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">
                    {parcel.senderDistrict}, {parcel.senderRegion}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaHome className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-900">{parcel.senderAddress}</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800 font-medium mb-1">Pickup Instruction</p>
                <p className="text-sm text-blue-700">{parcel.pickupInstruction}</p>
              </div>
            </div>
          </div>

          {/* Receiver Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTruck className="text-green-500" />
              Receiver Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaUser className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{parcel.receiverName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{parcel.receiverPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">
                    {parcel.receiverDistrict}, {parcel.receiverRegion}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaHome className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-900">{parcel.receiverAddress}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800 font-medium mb-1">Delivery Instruction</p>
                <p className="text-sm text-green-700">{parcel.deliveryInstruction}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-6">
          {/* Cost Summary Card */}
          <div className="bg-gradient-to-br from-[#caeb66] to-[#b8d959] rounded-lg shadow-sm p-6 text-gray-900">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaMoneyBillWave />
              Cost Summary
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Delivery Charge</span>
                <span className="font-semibold">৳{parcel.cost}</span>
              </div>
            </div>
            <div className="border-t border-gray-900/20 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">৳{parcel.cost}</span>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-purple-500" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold text-gray-900 text-sm">{formatDate(parcel.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-900 text-sm">{formatDate(parcel.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {/* Pay Now Button - Only for unpaid */}
              {parcel.status === "unpaid" && (
                <button
                  onClick={handlePayNow}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <FaMoneyBillWave />
                  Pay Now
                </button>
              )}

              {/* Track Button - Only if tracking number exists */}
              {parcel.tracking_no && (
                <button
                  onClick={handleTrack}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <FaMapMarkerAlt />
                  Track Parcel
                </button>
              )}

              {/* Delete Button - Only for unpaid */}
              {parcel.status === "unpaid" && (
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTrash />
                  {deleteMutation.isPending ? "Deleting..." : "Delete Parcel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetails;
