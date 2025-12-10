import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#caeb66] rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
