import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const EmptyState = ({ message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
      <FaBoxOpen className="text-6xl text-gray-300 mb-4" />
      <p className="text-lg text-gray-600 text-center mb-2">{message}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
