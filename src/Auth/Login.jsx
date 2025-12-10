import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser, signInWithGoogle } = useAuth();

  // Get the redirect path from location state, default to home
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  // Handle email/password login
  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    try {
      await signInUser(data.email, data.password);
      toast.success("Welcome back! 👋", { id: toastId, duration: 3000 });

      console.log("User logged in successfully");

      // Redirect to the page user was trying to access
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      // Set form error and show toast based on Firebase error
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password", { id: toastId });
        setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email", { id: toastId });
        setError("email", {
          type: "manual",
          message: "No account found with this email",
        });
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password", { id: toastId });
        setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.", { id: toastId });
        setError("root", {
          type: "manual",
          message: "Too many failed attempts. Please try again later.",
        });
      } else {
        toast.error("Failed to login. Please try again.", { id: toastId });
        setError("root", {
          type: "manual",
          message: error.message || "Failed to login. Please try again.",
        });
      }
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    const toastId = toast.loading("Signing in with Google...");

    try {
      await signInWithGoogle();
      toast.success("Welcome back! 👋", { id: toastId, duration: 3000 });

      console.log("Google login successful");

      // Redirect to the page user was trying to access
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google. Please try again.", { id: toastId });
      setError("root", {
        type: "manual",
        message: "Failed to login with Google. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-md">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Welcome Back</h1>
      <p className="text-gray-600 text-lg mb-8">Login with ZapShift</p>

      {/* Show redirect message if coming from private route */}
      {location.state?.from && (
        <div className="mb-6 p-4 bg-[#caeb66]/20 border border-[#caeb66] rounded-lg">
          <p className="text-[#1e3a4c] text-sm font-medium">
            Please login to continue to {location.state.from.pathname}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errors.root && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="Email"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
            } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder="Password"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
            } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
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
          disabled={isSubmitting}
          className="w-full bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login"}
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
          disabled={isSubmitting}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-xl text-red-500" />
          Login with google
        </button>
      </form>
    </div>
  );
};

export default Login;
