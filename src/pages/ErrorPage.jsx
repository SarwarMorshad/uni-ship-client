import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

const ErrorPage = () => {
  const error = useRouteError();

  // Determine error type
  const is404 = error?.status === 404 || error?.statusText === "Not Found";
  const errorMessage = error?.statusText || error?.message || "Something went wrong";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon/Illustration */}
        <div className="mb-8">
          {is404 ? (
            // 404 Illustration
            <div className="relative">
              <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 leading-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaExclamationTriangle className="text-6xl md:text-8xl text-primary animate-pulse" />
              </div>
            </div>
          ) : (
            // Generic Error Illustration
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-6xl text-red-500" />
              </div>
            </div>
          )}
        </div>

        {/* Error Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          {is404 ? "Page Not Found" : "Oops! Something Went Wrong"}
        </h2>

        {/* Error Description */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          {is404 ? "The page you're looking for doesn't exist or has been moved." : errorMessage}
        </p>

        {/* Error Details (Development) */}
        {/* {error && process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-lg mx-auto">
            <p className="text-sm font-semibold text-red-800 mb-2">Error Details:</p>
            <p className="text-xs text-red-600 break-words">
              {error.stack || error.message || JSON.stringify(error)}
            </p>
          </div>
        )} */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-[#b8d959] text-gray-900 font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FaHome className="text-xl" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg border-2 border-gray-300 transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">Need help? Try these links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/services" className="text-primary hover:text-[#b8d959] font-semibold">
              Services
            </Link>
            <Link to="/coverage" className="text-primary hover:text-[#b8d959] font-semibold">
              Coverage
            </Link>
            <Link to="/contact" className="text-primary hover:text-[#b8d959] font-semibold">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
