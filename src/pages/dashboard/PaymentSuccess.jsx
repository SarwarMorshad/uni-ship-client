import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaBox, FaMapMarkerAlt, FaHome, FaSpinner } from "react-icons/fa";
import { useVerifyPayment } from "../../hooks/usePayment";
import { useParcelDetails } from "../../hooks/useParcel";
import LoadingSpinner from "../../shared/LoadingSpinner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const hasVerified = useRef(false); // Prevent double verification

  const sessionId = searchParams.get("session_id");
  const parcelId = searchParams.get("parcel_id");
  const verifyMutation = useVerifyPayment();

  // Fetch parcel details
  const { data: parcelData } = useParcelDetails(parcelId || location.state?.parcelId);
  const parcel = parcelData?.parcel;

  // State from Cash on Delivery
  const cashState = location.state;

  useEffect(() => {
    // If Stripe payment and not already verified
    if (sessionId && parcelId && !hasVerified.current) {
      hasVerified.current = true; // Mark as verified

      verifyMutation.mutate(
        { sessionId, parcelId },
        {
          onSuccess: (data) => {
            setPaymentData(data);
          },
        }
      );
    }
  }, []); // Empty dependency array - run only once

  // If no state and no Stripe params, redirect to dashboard
  if (!cashState && !sessionId) {
    navigate("/dashboard/my-parcels");
    return null;
  }

  // Error state for Stripe verification (only show error if verification actually failed)
  if (sessionId && verifyMutation.isError && !paymentData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-6xl">❌</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-8">We couldn't verify your payment. Please contact support.</p>
          <button
            onClick={() => navigate("/dashboard/my-parcels")}
            className="px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg"
          >
            Back to My Parcels
          </button>
        </div>
      </div>
    );
  }

  // Get data from either Stripe or Cash on Delivery
  const paymentMethod = cashState?.paymentMethod || "stripe";
  const finalParcelId = parcelId || cashState?.parcelId;

  // Use actual parcel data if available
  const displayParcelName = parcel?.parcelName || cashState?.parcelName || "Parcel";
  const displayAmount = parcel?.cost || cashState?.amount || 0;
  const trackingNumber = paymentData?.tracking_no || parcel?.tracking_no;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {paymentMethod === "stripe" ? "Payment Successful!" : "Order Confirmed!"}
        </h1>
        <p className="text-gray-600 mb-8">
          {paymentMethod === "stripe"
            ? "Your payment has been processed successfully"
            : "Your order has been confirmed for Cash on Delivery"}
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-600">Parcel Name</span>
              <span className="font-semibold text-gray-900">{displayParcelName}</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-600">Amount</span>
              <span className="text-2xl font-bold text-green-600">৳{displayAmount}</span>
            </div>
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-600">Payment Method</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                {paymentMethod === "stripe" ? "Card Payment" : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {paymentMethod === "stripe" ? "Paid" : "Confirmed"}
              </span>
            </div>
            {(trackingNumber || verifyMutation.isPending) && (
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-gray-600">Tracking Number</span>
                {verifyMutation.isPending && !trackingNumber ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#caeb66] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500">Generating...</span>
                  </div>
                ) : (
                  <span className="font-mono font-bold text-[#caeb66] text-lg">{trackingNumber}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            <strong>What's Next?</strong>{" "}
            {paymentMethod === "stripe"
              ? "Your parcel has been assigned a tracking number. You can now track your parcel's journey in real-time."
              : "Your order is confirmed. Please keep the exact amount ready for delivery. A tracking number will be assigned soon."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`/dashboard/parcel/${finalParcelId}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FaBox />
            View Details
          </button>

          <button
            onClick={() => navigate(`/dashboard/my-parcels`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors"
          >
            <FaMapMarkerAlt />
            My Parcels
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FaHome />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
