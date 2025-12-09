import React from "react";
import { NavLink } from "react-router";

const Logo = () => {
  return (
    <div>
      <NavLink to="/" className="flex items-center">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform -skew-x-12">
            <span className="text-gray-900 font-bold text-xl transform skew-x-12">Z</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">ZapShift</span>
        </div>
      </NavLink>
    </div>
  );
};

export default Logo;
