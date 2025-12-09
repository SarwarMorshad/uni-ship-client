import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
    // Implement login logic here
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // Implement Google login logic here
  };

  return (
    <div className="max-w-md">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Welcome Back</h1>
      <p className="text-gray-600 text-lg mb-8">Login with ZapShift</p>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#caeb66] focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#caeb66] focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Forget Password Link */}
        <div className="text-left">
          <Link to="/forgot-password" className="text-gray-600 hover:text-gray-900 underline text-sm">
            Forget Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-gray-600 text-center">
          Don't have any account?{" "}
          <Link to="/register" className="text-[#caeb66] hover:text-[#b8d959] font-semibold">
            Register
          </Link>
        </p>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-600">Or</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
        >
          <FaGoogle className="text-xl text-red-500" />
          Login with google
        </button>
      </form>
    </div>
  );
};

export default Login;
