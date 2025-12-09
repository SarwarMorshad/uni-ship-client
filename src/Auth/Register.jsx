import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Register:", formData);
    // Implement registration logic here
  };

  const handleGoogleRegister = () => {
    console.log("Register with Google");
    // Implement Google registration logic here
  };

  return (
    <div className="max-w-md">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Create Account</h1>
      <p className="text-gray-600 text-lg mb-8">Register with ZapShift</p>

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#caeb66] focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400"
          />
        </div>

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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-900 font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#caeb66] focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#caeb66] hover:text-[#b8d959] font-semibold">
            Login
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

        {/* Google Register Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
        >
          <FaGoogle className="text-xl text-red-500" />
          Register with google
        </button>
      </form>
    </div>
  );
};

export default Register;
