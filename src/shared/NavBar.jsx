import { NavLink } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <NavLink to="/" className="flex items-center">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform -skew-x-12">
                <span className="text-gray-900 font-bold text-xl transform skew-x-12">Z</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">ZapShift</span>
            </div>
          </NavLink>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">{links}</div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/signin" className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium">
              Sign In
            </NavLink>
            <NavLink
              to="/signup"
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
                <NavLink to="/signin" className="text-gray-700 hover:text-gray-900 font-medium">
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-6 py-2 bg-primary hover:bg-[#b8d959] text-gray-800 font-semibold rounded-lg transition-colors text-center"
                >
                  Sign Up
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
