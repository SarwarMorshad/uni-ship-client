import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaMoneyBillWave, FaBox, FaCreditCard, FaStripe } from "react-icons/fa";
import { useParcelDetails } from "../../hooks/useParcel";
import { useCreateCheckoutSession } from "../../hooks/usePayment";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../shared/LoadingSpinner";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // Fetch parcel details
  const { data, isLoading, isError } = useParcelDetails(id);
  const parcel = data?.parcel;

  // Stripe checkout mutation
  const checkoutMutation = useCreateCheckoutSession();

  const handlePayment = async () => {
    if (paymentMethod === "stripe") {
      // Redirect to Stripe Checkout with user email
      await checkoutMutation.mutateAsync({
        parcelId: id,
        amount: parcel.cost,
        parcelName: parcel.parcelName,
        customerEmail: user?.email, // Pass logged-in user's email
      });
    } else {
      // Cash on Delivery - instant confirmation
      navigate("/dashboard/payment-success", {
        state: {
          parcelId: id,
          amount: parcel.cost,
          parcelName: parcel.parcelName,
          paymentMethod: "cash",
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !parcel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 mb-4">Parcel not found</p>
        <button
          onClick={() => navigate("/dashboard/my-parcels")}
          className="px-6 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg"
        >
          Back to My Parcels
        </button>
      </div>
    );
  }

  // Check if already paid
  if (parcel.status !== "unpaid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FaCheckCircle className="text-6xl text-green-500 mb-4" />
        <p className="text-xl font-bold text-gray-900 mb-2">Already Paid</p>
        <p className="text-gray-600 mb-4">This parcel has already been paid for</p>
        <button
          onClick={() => navigate(`/dashboard/parcel/${id}`)}
          className="px-6 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg"
        >
          View Parcel Details
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/my-parcels")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-xl text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
          <p className="text-gray-600 mt-1">Complete your parcel payment</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Payment Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Parcel Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaBox className="text-[#caeb66]" />
              Parcel Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Parcel Name</span>
                <span className="font-semibold text-gray-900">{parcel.parcelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 capitalize">{parcel.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight</span>
                <span className="font-semibold text-gray-900">{parcel.weight} KG</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Route</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{parcel.senderDistrict}</p>
                  <p className="text-sm text-gray-500">→ {parcel.receiverDistrict}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Receiver</span>
                <span className="font-semibold text-gray-900">{parcel.receiverName}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCreditCard className="text-blue-500" />
              Payment Method
            </h3>
            <div className="space-y-3">
              {/* Stripe Payment */}
              <label
                className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "stripe"
                    ? "border-[#635bff] bg-[#635bff]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-[#635bff] focus:ring-[#635bff]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FaStripe className="text-2xl text-[#635bff]" />
                    <span className="font-semibold text-gray-900">Pay with Stripe</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Credit/Debit Card, Apple Pay, Google Pay</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Secure</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Instant</span>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  paymentMethod === "cash"
                    ? "border-[#caeb66] bg-[#caeb66]/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-[#caeb66] focus:ring-[#caeb66]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600" />
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pay when your parcel is delivered</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="space-y-6">
          {/* Amount Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span className="font-semibold">৳{parcel.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold">৳0</span>
              </div>
              {paymentMethod === "stripe" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">USD Equivalent</span>
                  <span className="font-semibold text-blue-600">${(parcel.cost / 110).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#1e3a4c]">৳{parcel.cost}</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={checkoutMutation.isPending}
              className="w-full mt-6 px-6 py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {checkoutMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-3 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  {paymentMethod === "stripe" ? "Pay with Stripe" : "Confirm Order"}
                </>
              )}
            </button>

            {/* Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                {paymentMethod === "stripe" ? (
                  <>
                    <strong>Secure Payment:</strong> You'll be redirected to Stripe's secure payment page.
                    After payment, you'll receive a tracking number.
                  </>
                ) : (
                  <>
                    <strong>Note:</strong> You'll pay when the parcel is delivered to you. A tracking number
                    will be generated after confirmation.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
