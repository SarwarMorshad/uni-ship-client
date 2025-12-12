import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimesCircle, FaArrowLeft, FaRedo, FaHome } from "react-icons/fa";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border p-8 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <FaTimesCircle className="text-6xl text-red-500" />
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-8">Your payment was not completed. No charges were made.</p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">What happened?</h3>
              <p className="text-sm text-blue-800">
                You cancelled the payment or closed the checkout page. Your parcel booking is still saved and
                waiting for payment.
              </p>
            </div>
          </div>
        </div>

        {/* Reasons Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Common reasons for cancellation:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#caeb66] mt-1">•</span>
              <span>Changed your mind about payment method</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#caeb66] mt-1">•</span>
              <span>Need to verify payment details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#caeb66] mt-1">•</span>
              <span>Accidentally closed the checkout page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#caeb66] mt-1">•</span>
              <span>Want to use Cash on Delivery instead</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`/dashboard/pay/${id}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors"
          >
            <FaRedo />
            Try Again
          </button>

          <button
            onClick={() => navigate("/dashboard/my-parcels")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FaArrowLeft />
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

        {/* Help Text */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@zapshift.com" className="text-[#caeb66] hover:underline font-semibold">
              support@zapshift.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
