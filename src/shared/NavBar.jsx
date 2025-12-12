// src/shared/NavBar.jsx - UPDATED with Admin Dashboard Support
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import { useCheckAdmin } from "../hooks/useUser";
import toast from "react-hot-toast";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { data: adminData } = useCheckAdmin(user?.email);
  const navigate = useNavigate();

  const isAdmin = adminData?.isAdmin;

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");

    try {
      await logOut();
      toast.success("Logged out successfully! See you soon! 👋", { id: toastId, duration: 3000 });
      setIsProfileOpen(false);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.", { id: toastId });
    }
  };

  const links = (
    <>
      <NavLink
        to="/services"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Services
      </NavLink>
      <NavLink
        to="/coverage"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Coverage
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        About Us
      </NavLink>
      <NavLink
        to="/pricing"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Pricing
      </NavLink>
      <NavLink
        to="/sendParcel"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Send Parcel
      </NavLink>
      <NavLink
        to="/be-a-rider"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Be a Rider
      </NavLink>
    </>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">{links}</div>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {/* Dashboard Button - Shows Admin Dashboard for admins, User Dashboard for users */}
                <NavLink
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isActive ? "bg-primary text-gray-900" : "bg-primary text-gray-700 hover:bg-[#b8d959]"
                    }`
                  }
                >
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </NavLink>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || user.email || "User"
                          )}&background=caeb66&color=1e3a4c&bold=true`;
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-primary">
                        <span className="text-gray-900 font-bold text-lg">
                          {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">{user.displayName || "User"}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#caeb66] text-gray-900 text-xs font-semibold rounded">
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Show both dashboards for admin */}
                      {isAdmin && (
                        <>
                          <NavLink
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            Admin Dashboard
                          </NavLink>
                          <NavLink
                            to="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            User Dashboard
                          </NavLink>
                          <div className="border-t border-gray-200 my-2"></div>
                        </>
                      )}

                      <NavLink
                        to="/dashboard/my-parcels"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Parcels
                      </NavLink>
                      <NavLink
                        to="/dashboard/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Settings
                      </NavLink>
                      <NavLink
                        to="/dashboard/payment-history"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Payment History
                      </NavLink>
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
              </>
            ) : (
              // Not Logged In - Show Auth Buttons
              <>
                <NavLink to="/login" className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium">
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-6 py-2 bg-primary hover:bg-[#b8d959] text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden btn btn-ghost btn-circle">
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4">
              {links}
              <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                {user ? (
                  // Logged In - Mobile
                  <>
                    <div className="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-lg">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.displayName || user.email || "User"
                            )}&background=caeb66&color=1e3a4c&bold=true`;
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-primary">
                          <span className="text-gray-900 font-bold text-lg">
                            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.displayName || "User"}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#caeb66] text-gray-900 text-xs font-semibold rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dashboard Links for Mobile */}
                    {isAdmin ? (
                      <>
                        <NavLink
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-4 py-2 bg-primary hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors text-center"
                        >
                          Admin Dashboard
                        </NavLink>
                        <NavLink
                          to="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors text-center"
                        >
                          User Dashboard
                        </NavLink>
                      </>
                    ) : (
                      <NavLink
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="px-4 py-2 bg-primary hover:bg-[#b8d959] text-gray-900 font-semibold rounded-lg transition-colors text-center"
                      >
                        Dashboard
                      </NavLink>
                    )}

                    <NavLink
                      to="/dashboard/my-parcels"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      My Parcels
                    </NavLink>
                    <NavLink
                      to="/dashboard/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Settings
                    </NavLink>
                    <NavLink
                      to="/dashboard/payment-history"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Payment History
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="text-left text-red-600 hover:text-red-700 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Not Logged In - Mobile
                  <>
                    <NavLink
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-6 py-2 bg-primary hover:bg-[#b8d959] text-gray-800 font-semibold rounded-lg transition-colors text-center"
                    >
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isProfileOpen && <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>}
    </nav>
  );
};

export default NavBar;
