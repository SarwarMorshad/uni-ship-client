// src/pages/admin/AdminDashboard.jsx - 100% REAL DATA FROM DATABASE
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTruck,
  FaBoxOpen,
  FaEdit,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaCloudRain,
  FaFilter,
} from "react-icons/fa";
import { useAllParcels } from "../../hooks/useParcel";
import { useAllUsers } from "../../hooks/useUser";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: parcelsData, isLoading: parcelsLoading } = useAllParcels();
  const { data: usersData, isLoading: usersLoading } = useAllUsers();
  const [chartView, setChartView] = useState("packages"); // 'packages' or 'income'
  const [timeFilter, setTimeFilter] = useState("week"); // 'week', 'month', 'year'

  // ✅ REAL DATA: Calculate statistics from database
  const stats = useMemo(() => {
    if (!parcelsData?.parcels) return null;

    const parcels = parcelsData.parcels;

    return {
      toPay: parcels.filter((p) => p.paymentStatus === "unpaid").length,
      readyPickup: parcels.filter((p) => p.paymentStatus === "paid" && p.deliveryStatus === "pending").length,
      inTransit: parcels.filter((p) => p.deliveryStatus === "in-transit").length,
      readyDeliver: parcels.filter((p) => p.deliveryStatus === "out-for-delivery").length,
      delivered: parcels.filter((p) => p.deliveryStatus === "delivered").length,
    };
  }, [parcelsData]);

  // ✅ REAL DATA: Generate chart data from actual parcels
  const chartData = useMemo(() => {
    if (!parcelsData?.parcels) return [];

    const parcels = parcelsData.parcels;
    const now = new Date();

    if (timeFilter === "week") {
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      // Get start of current week (Monday)
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      return daysOfWeek.map((dayName, index) => {
        const targetDate = new Date(startOfWeek);
        targetDate.setDate(startOfWeek.getDate() + index);

        const dayParcels = parcels.filter((p) => {
          const parcelDate = new Date(p.createdAt);
          return (
            parcelDate.getDate() === targetDate.getDate() &&
            parcelDate.getMonth() === targetDate.getMonth() &&
            parcelDate.getFullYear() === targetDate.getFullYear()
          );
        });

        return {
          day: dayName,
          packages: dayParcels.length,
          income: dayParcels.reduce((sum, p) => sum + (p.price || 0), 0),
        };
      });
    }

    // For month/year, return weekly/monthly aggregates
    return [];
  }, [parcelsData, timeFilter]);

  // ✅ REAL DATA: Get recent parcels sorted by date
  const recentParcels = useMemo(() => {
    if (!parcelsData?.parcels) return [];
    return parcelsData.parcels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  }, [parcelsData]);

  // ✅ REAL DATA: Get late/unpaid invoices
  const lateInvoices = useMemo(() => {
    if (!parcelsData?.parcels) return [];

    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    return parcelsData.parcels
      .filter((p) => p.paymentStatus === "unpaid" && new Date(p.createdAt) < threeDaysAgo)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 6)
      .map((p) => ({
        ...p,
        daysOverdue: Math.floor((now - new Date(p.createdAt)) / (1000 * 60 * 60 * 24)),
      }));
  }, [parcelsData]);

  // ✅ REAL DATA: Calculate shipment alerts from database
  const alerts = useMemo(() => {
    if (!parcelsData?.parcels) return { damaged: 0, weatherDelays: 0, items: [] };

    const parcels = parcelsData.parcels;

    // Helper function for time ago (moved inside useMemo)
    const getTimeAgo = (date) => {
      const seconds = Math.floor((new Date() - date) / 1000);

      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
      return `${Math.floor(seconds / 86400)} days ago`;
    };

    // Count damaged parcels
    const damagedCount = parcels.filter(
      (p) =>
        p.deliveryStatus === "damaged" || p.status === "damaged" || p.notes?.toLowerCase().includes("damage")
    ).length;

    // Count weather delayed parcels
    const weatherDelayedCount = parcels.filter(
      (p) =>
        p.deliveryStatus === "delayed" ||
        p.status === "delayed" ||
        p.notes?.toLowerCase().includes("weather") ||
        p.notes?.toLowerCase().includes("delay")
    ).length;

    // Get recent alert items
    const alertItems = parcels
      .filter(
        (p) =>
          p.deliveryStatus === "damaged" ||
          p.deliveryStatus === "delayed" ||
          p.status === "damaged" ||
          p.status === "delayed"
      )
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 4)
      .map((p) => ({
        type: p.deliveryStatus === "damaged" || p.status === "damaged" ? "damaged" : "weather",
        shipmentId: p._id,
        time: getTimeAgo(new Date(p.updatedAt || p.createdAt)),
      }));

    return { damaged: damagedCount, weatherDelays: weatherDelayedCount, items: alertItems };
  }, [parcelsData]);

  if (parcelsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      delivered: "bg-green-100 text-green-700",
      "in-transit": "bg-blue-100 text-blue-700",
      "out-for-delivery": "bg-blue-100 text-blue-700",
      pending: "bg-orange-100 text-orange-700",
      waiting: "bg-red-100 text-red-700",
      damaged: "bg-red-100 text-red-700",
      delayed: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ✅ Statistics Cards - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
              <FaBox className="text-orange-600 text-xl" />
            </div>
            <p className="text-sm text-gray-500 font-medium">To Pay</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.toPay || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Unpaid parcels</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaBoxOpen className="text-blue-600 text-xl" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Ready Pick UP</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.readyPickup || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting pickup</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FaTruck className="text-purple-600 text-xl" />
            </div>
            <p className="text-sm text-gray-500 font-medium">In Transit</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.inTransit || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Being delivered</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FaShippingFast className="text-indigo-600 text-xl" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Ready to Deliver</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.readyDeliver || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Out for delivery</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <FaCheckCircle className="text-green-600 text-xl" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Delivered</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.delivered || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Successfully delivered</p>
        </div>
      </div>

      {/* ✅ Chart Section - REAL DATA */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Overall Statistics</h2>
          <div className="flex items-center gap-3">
            <select
              value={chartView}
              onChange={(e) => setChartView(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
            >
              <option value="packages">Packages</option>
              <option value="income">Income</option>
            </select>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#caeb66]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FaEllipsisV className="text-gray-500" />
            </button>
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#caeb66" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#caeb66" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey={chartView === "packages" ? "packages" : "income"}
                stroke="#caeb66"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <FaBox className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No data available for this period</p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Shipping Reports Table - REAL DATA */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Shipping Reports</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/parcels")}
                className="px-4 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 rounded-lg text-sm font-medium transition-colors"
              >
                View All Parcels
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaFilter className="text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaEllipsisV className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentParcels.length > 0 ? (
                recentParcels.map((parcel) => (
                  <tr key={parcel._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{parcel._id?.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parcel.senderName || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(parcel.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parcel.weight || 0} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${(parcel.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={parcel.deliveryStatus || parcel.status || "pending"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/parcels/${parcel._id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="More options"
                        >
                          <FaEllipsisV />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FaBox className="text-5xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg font-medium">No parcels found</p>
                    <p className="text-gray-400 text-sm mt-1">Create your first parcel to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {recentParcels.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <FaChevronLeft />
              Previous
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg text-sm bg-[#caeb66] text-gray-900 font-semibold">
                1
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Next
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ✅ Late Invoices - REAL DATA */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Late Invoices</h3>
            <button
              onClick={() => navigate("/admin/invoices")}
              className="px-4 py-2 bg-[#caeb66] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#b8d959] transition-colors"
            >
              View All Invoices
            </button>
          </div>
          <div className="space-y-3">
            {lateInvoices.length > 0 ? (
              lateInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      #{invoice._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{invoice.senderName || "Unknown Client"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${(invoice.price || 0).toFixed(2)}</p>
                    <p className="text-xs text-red-600 font-medium mt-1">
                      {invoice.daysOverdue} days overdue
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-4xl text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No late invoices</p>
                <p className="text-xs text-gray-400 mt-1">All payments are up to date!</p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Shipment Alerts - REAL DATA */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipment Alerts</h3>
            <button
              onClick={() => navigate("/admin/parcels?filter=alerts")}
              className="px-4 py-2 bg-[#caeb66] text-gray-900 rounded-lg text-sm font-medium hover:bg-[#b8d959] transition-colors"
            >
              View All Alerts
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-red-600">{alerts.damaged}</p>
              <p className="text-xs text-gray-600 mt-2 font-medium">Damaged</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
              <p className="text-3xl font-bold text-blue-600">{alerts.weatherDelays}</p>
              <p className="text-xs text-gray-600 mt-2 font-medium">Weather Delays</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.items.length > 0 ? (
              alerts.items.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 hover:bg-gray-50 px-2 rounded transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.type === "weather" ? "bg-blue-100" : "bg-red-100"
                    }`}
                  >
                    {alert.type === "weather" ? (
                      <FaCloudRain className="text-blue-600" />
                    ) : (
                      <FaExclamationTriangle className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.type === "weather" ? "Weather Delay" : "Damaged Package"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Shipment #{alert.shipmentId?.slice(-6).toUpperCase()} • {alert.time}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                    <FaEllipsisV className="text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-4xl text-green-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No alerts</p>
                <p className="text-xs text-gray-400 mt-1">All shipments are on track!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
