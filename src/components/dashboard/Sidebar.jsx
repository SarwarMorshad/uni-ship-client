import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaTruck,
  FaFileInvoice,
  FaStore,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaCog,
  FaKey,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Logo from "../../shared/Logo";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logOut();
      toast.success("Logged out successfully! See you soon! 👋", { id: toastId });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error("Failed to logout. Please try again.", { id: toastId });
    }
  };

  const menuItems = [
    { title: "Dashboard", icon: FaHome, path: "/dashboard", section: "MENU" },
    { title: "My Parcels", icon: FaTruck, path: "/dashboard/my-parcels", section: "MENU" },
    { title: "Parcels To Pay", icon: FaMoneyBillWave, path: "/dashboard/parcels-to-pay", section: "MENU" },
    { title: "Tracking", icon: FaMapMarkedAlt, path: "/dashboard/tracking", section: "MENU" },
    { title: "Payment History", icon: FaFileInvoice, path: "/dashboard/payment-history", section: "MENU" },
  ];

  const generalItems = [
    { title: "Settings", icon: FaCog, path: "/dashboard/settings", section: "GENERAL" },
    { title: "Change Password", icon: FaKey, path: "/dashboard/change-password", section: "GENERAL" },
    { title: "Help", icon: FaQuestionCircle, path: "/dashboard/help", section: "GENERAL" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen && (
              <div className="flex items-center gap-2">
                <Logo />
              </div>
            )}
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FaBars className="text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          {isOpen && user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName}&background=caeb66&color=1e3a4c`
                  }
                  alt={user?.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">User</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {/* MENU Section */}
            {isOpen && <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Menu</p>}
            <div className="space-y-1 mb-6">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#caeb66] text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    } ${!isOpen && "justify-center"}`
                  }
                  title={!isOpen ? item.title : ""}
                >
                  <item.icon className="text-lg flex-shrink-0" />
                  {isOpen && <span className="text-sm">{item.title}</span>}
                </NavLink>
              ))}
            </div>

            {/* GENERAL Section */}
            {isOpen && <p className="text-xs font-semibold text-gray-400 uppercase mb-3">General</p>}
            <div className="space-y-1">
              {generalItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#caeb66] text-gray-900 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    } ${!isOpen && "justify-center"}`
                  }
                  title={!isOpen ? item.title : ""}
                >
                  <item.icon className="text-lg flex-shrink-0" />
                  {isOpen && <span className="text-sm">{item.title}</span>}
                </NavLink>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
                  !isOpen && "justify-center"
                }`}
                title={!isOpen ? "Logout" : ""}
              >
                <FaSignOutAlt className="text-lg flex-shrink-0" />
                {isOpen && <span className="text-sm">Logout</span>}
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
