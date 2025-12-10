import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaMapMarkerAlt, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import StatusBadge from "../../shared/StatusBadge";
import LoadingSpinner from "../../shared/LoadingSpinner";
import EmptyState from "../../shared/EmptyState";

const MyParcels = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch parcels on component mount
  useEffect(() => {
    fetchParcels();
  }, [user]);

  // Filter parcels when search or status filter changes
  useEffect(() => {
    filterParcels();
  }, [searchQuery, statusFilter, parcels]);

  const fetchParcels = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const response = await axios.get(`/parcels/user/${user.email}`);

      if (response.data.success) {
        setParcels(response.data.parcels);
      }
    } catch (error) {
      console.error("Error fetching parcels:", error);
      toast.error("Failed to load parcels");
    } finally {
      setLoading(false);
    }
  };

  const filterParcels = () => {
    let filtered = parcels;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((parcel) => parcel.status === statusFilter);
    }

    // Filter by search query (parcel name, tracking number, receiver name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (parcel) =>
          parcel.parcelName?.toLowerCase().includes(query) ||
          parcel.tracking_no?.toLowerCase().includes(query) ||
          parcel.receiverName?.toLowerCase().includes(query) ||
          parcel.receiverPhone?.includes(query)
      );
    }

    setFilteredParcels(filtered);
  };

  const getStatusCounts = () => {
    return {
      all: parcels.length,
      unpaid: parcels.filter((p) => p.status === "unpaid").length,
      paid: parcels.filter((p) => p.status === "paid").length,
      "in-transit": parcels.filter((p) => p.status === "in-transit").length,
      delivered: parcels.filter((p) => p.status === "delivered").length,
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Parcels</h2>
          <p className="text-gray-600 mt-1">Manage and track all your parcels</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === "all"
              ? "border-[#caeb66] bg-[#caeb66]/10"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          <p className="text-sm text-gray-600 mt-1">All Parcels</p>
        </button>

        <button
          onClick={() => setStatusFilter("unpaid")}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === "unpaid" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-red-600">{statusCounts.unpaid}</p>
          <p className="text-sm text-gray-600 mt-1">To Pay</p>
        </button>

        <button
          onClick={() => setStatusFilter("paid")}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === "paid" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-blue-600">{statusCounts.paid}</p>
          <p className="text-sm text-gray-600 mt-1">Paid</p>
        </button>

        <button
          onClick={() => setStatusFilter("in-transit")}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === "in-transit"
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-yellow-600">{statusCounts["in-transit"]}</p>
          <p className="text-sm text-gray-600 mt-1">In Transit</p>
        </button>

        <button
          onClick={() => setStatusFilter("delivered")}
          className={`p-4 rounded-lg border-2 transition-all ${
            statusFilter === "delivered"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
          <p className="text-sm text-gray-600 mt-1">Delivered</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by parcel name, tracking number, receiver..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#caeb66] focus:border-[#caeb66] outline-none"
        />
      </div>

      {/* Parcels Table */}
      {filteredParcels.length === 0 ? (
        <EmptyState
          message={
            searchQuery || statusFilter !== "all"
              ? "No parcels found matching your filters"
              : "You haven't created any parcels yet"
          }
          action={
            <button
              onClick={() => navigate("/dashboard/add-parcel")}
              className="mt-4 px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Create Your First Parcel
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Parcel Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tracking #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{parcel.parcelName}</p>
                        <p className="text-sm text-gray-500 capitalize">{parcel.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-900">{parcel.tracking_no || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{parcel.receiverName}</p>
                        <p className="text-sm text-gray-500">{parcel.receiverPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{parcel.senderDistrict}</p>
                        <p className="text-gray-500">→ {parcel.receiverDistrict}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatDate(parcel.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">৳{parcel.cost}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={parcel.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => navigate(`/dashboard/parcel/${parcel._id}`)}
                          className="p-2 text-gray-600 hover:text-[#caeb66] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {/* Pay Button (only for unpaid) */}
                        {parcel.status === "unpaid" && (
                          <button
                            onClick={() => navigate(`/dashboard/pay/${parcel._id}`)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Pay Now"
                          >
                            <FaMoneyBillWave />
                          </button>
                        )}

                        {/* Track Button (only if paid) */}
                        {parcel.tracking_no && (
                          <button
                            onClick={() => navigate(`/dashboard/track/${parcel.tracking_no}`)}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Track Parcel"
                          >
                            <FaMapMarkerAlt />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcels;
