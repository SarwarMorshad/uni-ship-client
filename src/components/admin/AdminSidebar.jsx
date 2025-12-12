// src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaCog,
  FaKey,
  FaQuestionCircle,
  FaSignOutAlt,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const menuItems = [
    {
      path: "/admin",
      icon: FaTachometerAlt,
      label: "Dashboard",
      end: true,
    },
    {
      path: "/admin/shipping",
      icon: FaBox,
      label: "Shipping",
    },
    {
      path: "/admin/clients",
      icon: FaUsers,
      label: "Clients",
    },
    {
      path: "/admin/invoices",
      icon: FaFileInvoiceDollar,
      label: "Invoices",
    },
    {
      path: "/admin/analytics",
      icon: FaChartBar,
      label: "Analytics",
    },
  ];

  const generalItems = [
    {
      path: "/admin/settings",
      icon: FaCog,
      label: "Settings",
    },
    {
      path: "/admin/change-password",
      icon: FaKey,
      label: "Change Password",
    },
    {
      path: "/admin/help",
      icon: FaQuestionCircle,
      label: "Help",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
            {isOpen ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#caeb66] rounded-lg flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-xl">Z</span>
                  </div>
                  <Link to="/" className="text-xl font-bold text-gray-900">
                    <span className="font-bold text-xl text-gray-900">ZapShift</span>
                  </Link>
                </div>
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
                  <FaTimes className="text-gray-600" />
                </button>
              </>
            ) : (
              <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg mx-auto">
                <FaBars className="text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            {/* MENU Section */}
            <div className="px-4 mb-6">
              {isOpen && <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">MENU</p>}
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#caeb66] text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      } ${!isOpen && "justify-center"}`
                    }
                    title={!isOpen ? item.label : ""}
                  >
                    <item.icon className="text-lg flex-shrink-0" />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* GENERAL Section */}
            <div className="px-4">
              {isOpen && <p className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">GENERAL</p>}
              <div className="space-y-1">
                {generalItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#caeb66] text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      } ${!isOpen && "justify-center"}`
                    }
                    title={!isOpen ? item.label : ""}
                  >
                    <item.icon className="text-lg flex-shrink-0" />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </NavLink>
                ))}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors ${
                    !isOpen && "justify-center"
                  }`}
                  title={!isOpen ? "Logout" : ""}
                >
                  <FaSignOutAlt className="text-lg flex-shrink-0" />
                  {isOpen && <span className="text-sm">Logout</span>}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
