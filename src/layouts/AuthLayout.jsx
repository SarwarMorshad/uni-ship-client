import React from "react";
import Logo from "../shared/Logo";
import { Outlet } from "react-router";
import authImage from "../assets/authimage.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>

      {/* Main Content */}
      <div className="min-h-screen grid lg:grid-cols-2 gap-0">
        {/* Left Side - Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#f0f9f4] to-[#e8f5e9] p-12">
          <div className="w-full max-w-2xl">
            <img src={authImage} alt="Authentication" className="w-full h-auto object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
