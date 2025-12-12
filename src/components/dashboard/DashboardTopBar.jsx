import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaPlus } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const DashboardTopBar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logOut();
      toast.success("Logged out successfully! See you soon! 👋", { id: toastId });
      setIsProfileOpen(false);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.", { id: toastId });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Page Title */}
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">
            You can access all your data and information from anywhere.
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Add Parcel Button */}
          <button
            onClick={() => navigate("/dashboard/add-parcel")}
            className="flex items-center gap-2 px-4 py-2 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors shadow-sm"
          >
            <FaPlus />
            <span className="hidden sm:inline">Add Parcel</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <FaBell className="text-gray-600 text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}&background=caeb66&color=1e3a4c`
                }
                alt={user?.displayName}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
                referrerPolicy="no-referrer"
              />
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user?.displayName}</p>
                {/* <p className="text-xs text-gray-500">Admin</p> */}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{user?.displayName || "User"}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate("/dashboard/my-parcels");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  My Parcels
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/parcels-to-pay");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Parcels To Pay
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/payment-history");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Payment History
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard/settings");
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Settings
                </button>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />}
    </header>
  );
};

export default DashboardTopBar;
