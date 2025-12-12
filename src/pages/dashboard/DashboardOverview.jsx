import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaArrowRight,
  FaPlus,
  FaHistory,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useUserParcels } from "../../hooks/useParcel";
import { usePaymentHistory } from "../../hooks/usePayment";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../shared/LoadingSpinner";

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user data
  const { data: parcelsData, isLoading: parcelsLoading } = useUserParcels(user?.email);
  const { data: paymentsData, isLoading: paymentsLoading } = usePaymentHistory(user?.email);

  const parcels = parcelsData?.parcels || [];
  const payments = paymentsData?.payments || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalParcels = parcels.length;
    const unpaidParcels = parcels.filter((p) => p.status === "unpaid").length;
    const paidParcels = parcels.filter((p) => p.status === "paid").length;
    const inTransitParcels = parcels.filter((p) => p.status === "in-transit").length;
    const deliveredParcels = parcels.filter((p) => p.status === "delivered").length;

    const totalPayments = payments.length;
    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentParcels = parcels.filter((p) => new Date(p.createdAt) >= sevenDaysAgo).length;
    const recentPayments = payments.filter((p) => new Date(p.createdAt) >= sevenDaysAgo).length;

    return {
      totalParcels,
      unpaidParcels,
      paidParcels,
      inTransitParcels,
      deliveredParcels,
      totalPayments,
      totalSpent,
      recentParcels,
      recentPayments,
    };
  }, [parcels, payments]);

  // Recent parcels (last 5)
  const recentParcels = useMemo(() => {
    return [...parcels].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [parcels]);

  // Recent payments (last 5)
  const recentPayments = useMemo(() => {
    return [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [payments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      unpaid: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      "in-transit": "bg-blue-100 text-blue-800",
      delivered: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (parcelsLoading || paymentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1e3a4c] to-[#2d5468] rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.displayName || "User"}! 👋</h1>
        <p className="text-white/80">Here's what's happening with your parcels today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Parcels */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBox className="text-xl text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalParcels}</p>
          <p className="text-sm text-gray-600">Total Parcels</p>
          {stats.recentParcels > 0 && (
            <p className="text-xs text-green-600 mt-2">+{stats.recentParcels} this week</p>
          )}
        </div>

        {/* Unpaid Parcels */}
        <div
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate("/dashboard/parcels-to-pay")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-xl text-yellow-600" />
            </div>
            <FaArrowRight className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.unpaidParcels}</p>
          <p className="text-sm text-gray-600">Awaiting Payment</p>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTruck className="text-xl text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-1">{stats.inTransitParcels}</p>
          <p className="text-sm text-gray-600">In Transit</p>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-xl text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Completed</span>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">{stats.deliveredParcels}</p>
          <p className="text-sm text-gray-600">Delivered</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaMoneyBillWave className="text-3xl text-white/80" />
            <FaCreditCard className="text-2xl text-white/50" />
          </div>
          <p className="text-sm text-white/80 mb-2">Total Spent</p>
          <p className="text-4xl font-bold">৳{stats.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-white/80 mt-2">{stats.totalPayments} payments made</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/send-parcel")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-[#caeb66] hover:bg-[#b8d959] rounded-lg transition-colors text-left"
            >
              <FaPlus className="text-gray-900" />
              <div>
                <p className="font-semibold text-gray-900">Send New Parcel</p>
                <p className="text-xs text-gray-700">Book a new delivery</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/dashboard/track-parcel")}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
            >
              <FaMapMarkerAlt className="text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Track Parcel</p>
                <p className="text-xs text-gray-600">Track your delivery</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Parcels */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900">Recent Parcels</h3>
            <button
              onClick={() => navigate("/dashboard/my-parcels")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              View All <FaArrowRight />
            </button>
          </div>
          <div className="divide-y">
            {recentParcels.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaBox className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No parcels yet</p>
              </div>
            ) : (
              recentParcels.map((parcel) => (
                <div
                  key={parcel._id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/parcel/${parcel._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{parcel.parcelName}</p>
                      <p className="text-sm text-gray-600">
                        {parcel.senderDistrict} → {parcel.receiverDistrict}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(parcel.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          parcel.status
                        )}`}
                      >
                        {parcel.status}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">৳{parcel.cost}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
            <button
              onClick={() => navigate("/dashboard/payment-history")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              View All <FaArrowRight />
            </button>
          </div>
          <div className="divide-y">
            {recentPayments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaHistory className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No payments yet</p>
              </div>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {payment.paymentMethod === "stripe" ? (
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FaCreditCard className="text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <FaMoneyBillWave className="text-green-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{payment.parcelName}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">৳{payment.amount}</p>
                      <p className="text-xs text-green-600">Paid</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              Have questions about your parcels or payments? Our support team is here to help!
            </p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
