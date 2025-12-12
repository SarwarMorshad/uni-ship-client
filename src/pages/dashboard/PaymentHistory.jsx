import React, { useState, useMemo } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaCalendarAlt,
  FaBox,
  FaReceipt,
} from "react-icons/fa";
import { usePaymentHistory } from "../../hooks/usePayment";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../shared/LoadingSpinner";
import EmptyState from "../../shared/EmptyState";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sortBy, setSortBy] = useState("date-desc"); // date-desc, date-asc, amount-desc, amount-asc

  // Fetch payment history
  const { data, isLoading, isError, error } = usePaymentHistory(user?.email);
  const payments = data?.payments || [];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const stripePayments = payments.filter((p) => p.paymentMethod === "stripe").length;
    const cashPayments = payments.filter((p) => p.paymentMethod === "cash").length;

    return { totalPayments, totalSpent, stripePayments, cashPayments };
  }, [payments]);

  // Filter and sort payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.parcelName.toLowerCase().includes(search) ||
          payment.trackingNumber.toLowerCase().includes(search) ||
          payment.stripeTransactionId?.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [payments, searchTerm, sortBy]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        <p className="text-red-600 mb-4">Failed to load payment history</p>
        <p className="text-gray-600">{error?.message}</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={FaReceipt}
        title="No Payment History"
        message="You haven't made any payments yet. Start by booking a parcel!"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <p className="text-gray-600 mt-1">View all your payment transactions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPayments}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaReceipt className="text-xl text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600 mt-1">৳{stats.totalSpent}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Card Payments</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.stripePayments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaCreditCard className="text-xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Payments</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.cashPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-xl text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by parcel name, tracking number, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredPayments.length} of {payments.length} payments
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-600">No payments match your search criteria</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parcel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tracking No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaBox className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{payment.parcelName}</p>
                          <p className="text-xs text-gray-500">{payment.route}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-[#caeb66] font-semibold">
                        {payment.trackingNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.paymentMethod === "stripe" ? (
                        <div className="flex items-center gap-2">
                          <FaCreditCard className="text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-900 capitalize">
                              {payment.paymentDetails?.brand || "Card"}
                            </p>
                            {payment.paymentDetails?.last4 && (
                              <p className="text-xs text-gray-500">•••• {payment.paymentDetails.last4}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-green-500" />
                          <span className="text-sm text-gray-900">Cash</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">৳{payment.amount}</p>
                        {payment.amountPaidUSD && (
                          <p className="text-xs text-gray-500">${payment.amountPaidUSD.toFixed(2)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FaCheckCircle />
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};

// Payment Details Modal Component
const PaymentDetailsModal = ({ payment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Payment Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-mono text-sm text-gray-900">{payment._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm text-gray-900">{payment.stripeTransactionId || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Date</span>
              <span className="text-gray-900">{new Date(payment.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Parcel Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Parcel Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Parcel Name</span>
                <span className="font-medium text-gray-900">{payment.parcelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number</span>
                <span className="font-mono text-[#caeb66] font-semibold">{payment.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="text-gray-900">{payment.route}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900 capitalize">{payment.paymentMethod}</span>
              </div>
              {payment.paymentDetails && (
                <>
                  {payment.paymentDetails.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Brand</span>
                      <span className="text-gray-900 capitalize">{payment.paymentDetails.brand}</span>
                    </div>
                  )}
                  {payment.paymentDetails.last4 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Number</span>
                      <span className="text-gray-900">•••• {payment.paymentDetails.last4}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-900 font-semibold">Amount Paid (BDT)</span>
                <span className="text-2xl font-bold text-green-600">৳{payment.amount}</span>
              </div>
              {payment.amountPaidUSD && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount (USD)</span>
                  <span className="text-gray-900">${payment.amountPaidUSD.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg">
            <FaCheckCircle className="text-green-600" />
            <span className="text-green-800 font-semibold">Payment Successful</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
