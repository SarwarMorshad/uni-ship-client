import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaClock,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";
import { useUserParcels } from "../../hooks/useParcel";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../shared/LoadingSpinner";
import EmptyState from "../../shared/EmptyState";

const ParcelsToPay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterByAmount, setFilterByAmount] = useState("all"); // all, low, medium, high

  // Fetch unpaid parcels
  const { data: parcelsData, isLoading } = useUserParcels(user?.email);
  const allParcels = parcelsData?.parcels || [];
  const unpaidParcels = allParcels.filter((p) => p.status === "unpaid");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalParcels = unpaidParcels.length;
    const totalAmount = unpaidParcels.reduce((sum, p) => sum + p.cost, 0);
    const selectedAmount = selectedParcels.reduce((sum, id) => {
      const parcel = unpaidParcels.find((p) => p._id === id);
      return sum + (parcel?.cost || 0);
    }, 0);

    // Count by urgency (older than 7 days = urgent)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const urgent = unpaidParcels.filter((p) => new Date(p.createdAt) < sevenDaysAgo).length;

    return { totalParcels, totalAmount, selectedAmount, urgent };
  }, [unpaidParcels, selectedParcels]);

  // Filter and sort parcels
  const filteredParcels = useMemo(() => {
    let filtered = [...unpaidParcels];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (parcel) =>
          parcel.parcelName.toLowerCase().includes(search) ||
          parcel.receiverName.toLowerCase().includes(search) ||
          parcel.receiverDistrict.toLowerCase().includes(search) ||
          parcel.tracking_no?.toLowerCase().includes(search)
      );
    }

    // Amount filter
    if (filterByAmount !== "all") {
      filtered = filtered.filter((parcel) => {
        if (filterByAmount === "low") return parcel.cost < 100;
        if (filterByAmount === "medium") return parcel.cost >= 100 && parcel.cost < 200;
        if (filterByAmount === "high") return parcel.cost >= 200;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-desc":
          return b.cost - a.cost;
        case "amount-asc":
          return a.cost - b.cost;
        default:
          return 0;
      }
    });

    return filtered;
  }, [unpaidParcels, searchTerm, filterByAmount, sortBy]);

  // Toggle parcel selection
  const toggleParcelSelection = (parcelId) => {
    setSelectedParcels((prev) =>
      prev.includes(parcelId) ? prev.filter((id) => id !== parcelId) : [...prev, parcelId]
    );
  };

  // Select all parcels
  const toggleSelectAll = () => {
    if (selectedParcels.length === filteredParcels.length) {
      setSelectedParcels([]);
    } else {
      setSelectedParcels(filteredParcels.map((p) => p._id));
    }
  };

  // Pay selected parcels
  const handlePaySelected = () => {
    if (selectedParcels.length === 0) return;
    // For now, navigate to first selected parcel's payment page
    navigate(`/dashboard/pay/${selectedParcels[0]}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysOverdue = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const isUrgent = (dateString) => {
    return getDaysOverdue(dateString) > 7;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (unpaidParcels.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={FaCheckCircle}
          title="All Caught Up!"
          message="You don't have any parcels awaiting payment. All your parcels are paid!"
          actionLabel="View My Parcels"
          onAction={() => navigate("/dashboard/my-parcels")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parcels To Pay</h1>
          <p className="text-sm text-gray-600 mt-1">Complete payment for your pending parcels</p>
        </div>
        {selectedParcels.length > 0 && (
          <button
            onClick={handlePaySelected}
            className="flex items-center gap-2 px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors shadow-sm"
          >
            <FaCreditCard />
            Pay Selected (৳{stats.selectedAmount})
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Unpaid */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-xl text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalParcels}</p>
          <p className="text-sm text-gray-600">Total Unpaid Parcels</p>
        </div>

        {/* Total Amount Due */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-xl text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600 mb-1">৳{stats.totalAmount}</p>
          <p className="text-sm text-gray-600">Total Amount Due</p>
        </div>

        {/* Urgent Payments */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="text-xl text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600 mb-1">{stats.urgent}</p>
          <p className="text-sm text-gray-600">Urgent (7+ days old)</p>
        </div>

        {/* Selected */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-xl text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-1">{selectedParcels.length}</p>
          <p className="text-sm text-gray-600">Selected for Payment</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by parcel name, receiver, tracking number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
            />
          </div>

          {/* Amount Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <select
              value={filterByAmount}
              onChange={(e) => setFilterByAmount(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] bg-white"
            >
              <option value="all">All Amounts</option>
              <option value="low">Low (&lt;৳100)</option>
              <option value="medium">Medium (৳100-200)</option>
              <option value="high">High (৳200+)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <FaSortAmountDown className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caeb66] bg-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count and Select All */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredParcels.length} of {unpaidParcels.length} parcels
        </p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedParcels.length === filteredParcels.length && filteredParcels.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 text-[#caeb66] border-gray-300 rounded focus:ring-[#caeb66]"
          />
          <span className="text-sm font-medium text-gray-700">Select All</span>
        </label>
      </div>

      {/* Parcels List */}
      {filteredParcels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <FaBox className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No parcels match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredParcels.map((parcel) => {
            const isSelected = selectedParcels.includes(parcel._id);
            const urgent = isUrgent(parcel.createdAt);
            const daysOld = getDaysOverdue(parcel.createdAt);

            return (
              <div
                key={parcel._id}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                  isSelected ? "border-[#caeb66] ring-2 ring-[#caeb66]/20" : "border-gray-200"
                } ${urgent ? "bg-orange-50/30" : ""}`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex items-center pt-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleParcelSelection(parcel._id)}
                        className="w-5 h-5 text-[#caeb66] border-gray-300 rounded focus:ring-[#caeb66] cursor-pointer"
                      />
                    </div>

                    {/* Parcel Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                          urgent ? "bg-orange-100" : "bg-blue-100"
                        }`}
                      >
                        <FaBox className={`text-2xl ${urgent ? "text-orange-600" : "text-blue-600"}`} />
                      </div>
                    </div>

                    {/* Parcel Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{parcel.parcelName}</h3>
                          {urgent && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                              <FaExclamationTriangle />
                              Urgent - {daysOld} days old
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">৳{parcel.cost}</p>
                          <p className="text-xs text-gray-500 mt-1">${(parcel.cost / 110).toFixed(2)} USD</p>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="font-medium">{parcel.senderDistrict}</span>
                        <span>→</span>
                        <span className="font-medium">{parcel.receiverDistrict}</span>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Receiver</p>
                          <p className="text-sm font-medium text-gray-900">{parcel.receiverName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="text-sm font-medium text-gray-900">{parcel.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{parcel.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Booked</p>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                            <FaCalendarAlt className="text-gray-400 text-xs" />
                            {formatDate(parcel.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <button
                          onClick={() => navigate(`/dashboard/pay/${parcel._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors"
                        >
                          <FaCreditCard />
                          Pay Now
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/parcel/${parcel._id}`)}
                          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Payment Footer (Sticky) */}
      {selectedParcels.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Selected Parcels</p>
                  <p className="text-xl font-bold text-gray-900">{selectedParcels.length}</p>
                </div>
                <div className="h-12 w-px bg-gray-300" />
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold text-[#caeb66]">৳{stats.selectedAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedParcels([])}
                  className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handlePaySelected}
                  className="flex items-center gap-2 px-8 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold rounded-lg transition-colors shadow-sm"
                >
                  <FaCreditCard />
                  Pay ৳{stats.selectedAmount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelsToPay;
