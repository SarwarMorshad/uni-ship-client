import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      setIsProfileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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
        to="/blog"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Blog
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          isActive ? "text-primary font-bold" : "text-gray-700 hover:text-gray-900 font-medium"
        }
      >
        Contact
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
          <div className="hidden md:flex items-center gap-8">{links}</div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // Logged In - Show Profile
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <span className="text-gray-700 font-medium">{user.displayName || "User"}</span>
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
                    </div>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Orders
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
                <button className="w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden btn btn-ghost btn-circle">
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
          <div className="md:hidden mt-4 pb-4">
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
                      </div>
                    </div>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-700 hover:text-gray-900 font-medium"
                    >
                      My Orders
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
