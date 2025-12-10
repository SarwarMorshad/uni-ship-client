import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "unpaid":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Unpaid",
        };
      case "paid":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Paid",
        };
      case "ready-to-pickup":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          label: "Ready to Pickup",
        };
      case "in-transit":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "In Transit",
        };
      case "reached-service-center":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-700",
          label: "At Service Center",
        };
      case "shipped":
        return {
          bg: "bg-cyan-100",
          text: "text-cyan-700",
          label: "Shipped",
        };
      case "ready-for-delivery":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          label: "Ready for Delivery",
        };
      case "delivered":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Delivered",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
