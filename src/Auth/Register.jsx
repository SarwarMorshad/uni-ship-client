import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    watch,
  } = useForm({
    mode: "onChange", // Enable real-time validation
  });

  // Watch all fields for real-time validation feedback
  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const photoURL = watch("photoURL");

  // Validation status helpers
  const isNameValid = name && name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
  const isEmailValid = email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  const isPasswordValid =
    password && password.length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/.test(password);
  const isConfirmPasswordValid = confirmPassword && confirmPassword === password;
  const isPhotoURLValid = photoURL && /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(photoURL);

  // Handle email/password registration
  const onSubmit = async (data) => {
    try {
      // Create user with email and password
      await createUser(data.email, data.password);

      // Update user profile with display name and photo URL
      await updateUserProfile(data.name, data.photoURL || null);

      console.log("User registered successfully");
      // Redirect to home or dashboard
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      // Set form error based on Firebase error
      if (error.code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email is already registered",
        });
      } else if (error.code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password is too weak",
        });
      } else if (error.code === "auth/invalid-email") {
        setError("email", {
          type: "manual",
          message: "Invalid email address",
        });
      } else {
        setError("root", {
          type: "manual",
          message: error.message || "Failed to register. Please try again.",
        });
      }
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      console.log("Google registration successful");
      navigate("/");
    } catch (error) {
      console.error("Google registration error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to register with Google. Please try again.",
      });
    }
  };

  // Validation icon component
  const ValidationIcon = ({ isValid, isTouched }) => {
    if (!isTouched) return null;
    return isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />;
  };

  return (
    <div className="max-w-md">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Create Account</h1>
      <p className="text-gray-600 text-lg mb-8">Register with ZapShift</p>

      {/* Error Message */}
      {errors.root && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              })}
              placeholder="Full Name"
              className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : name && isNameValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
              } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 transition-all`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ValidationIcon isValid={isNameValid} isTouched={touchedFields.name || name} />
            </div>
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          {name && !errors.name && isNameValid && (
            <p className="mt-1 text-sm text-green-600">✓ Looks good!</p>
          )}
        </div>

        {/* Profile Image URL */}
        <div>
          <label htmlFor="photoURL" className="block text-gray-900 font-medium mb-2">
            Profile Picture URL (Optional)
          </label>
          <div className="flex items-start gap-4">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              {photoURL && isPhotoURLValid ? (
                <img
                  src={photoURL}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/80?text=Invalid";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
              )}
            </div>

            {/* URL Input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="url"
                  id="photoURL"
                  {...register("photoURL", {
                    pattern: {
                      value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i,
                      message: "Please enter a valid image URL (jpg, png, webp, gif, svg)",
                    },
                  })}
                  placeholder="https://example.com/profile.jpg"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.photoURL
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : photoURL && isPhotoURLValid
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
                  } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 transition-all`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <ValidationIcon isValid={isPhotoURLValid} isTouched={touchedFields.photoURL || photoURL} />
                </div>
              </div>
              {errors.photoURL && <p className="mt-1 text-sm text-red-600">{errors.photoURL.message}</p>}
              {photoURL && !errors.photoURL && isPhotoURLValid && (
                <p className="mt-1 text-sm text-green-600">✓ Valid image URL</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Enter a direct link to your profile image</p>
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
            Email
          </label>
          <div className="relative">
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
              className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : email && isEmailValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
              } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 transition-all`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ValidationIcon isValid={isEmailValid} isTouched={touchedFields.email || email} />
            </div>
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          {email && !errors.email && isEmailValid && (
            <p className="mt-1 text-sm text-green-600">✓ Valid email format</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
                  message: "Password must contain at least one letter and one number",
                },
              })}
              placeholder="Password"
              className={`w-full px-4 py-3 pr-24 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : password && isPasswordValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
              } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 transition-all`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
              <ValidationIcon isValid={isPasswordValid} isTouched={touchedFields.password || password} />
            </div>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          {/* Password strength indicators */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className={password.length >= 6 ? "text-green-600" : "text-gray-400"}>
                  {password.length >= 6 ? "✓" : "○"} At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={/[A-Za-z]/.test(password) ? "text-green-600" : "text-gray-400"}>
                  {/[A-Za-z]/.test(password) ? "✓" : "○"} Contains a letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={/\d/.test(password) ? "text-green-600" : "text-gray-400"}>
                  {/\d/.test(password) ? "✓" : "○"} Contains a number
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-900 font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 pr-24 rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : confirmPassword && isConfirmPasswordValid
                  ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                  : "border-gray-300 focus:border-[#caeb66] focus:ring-[#caeb66]/20"
              } focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 transition-all`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
              <ValidationIcon
                isValid={isConfirmPasswordValid}
                isTouched={touchedFields.confirmPassword || confirmPassword}
              />
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
          {confirmPassword && !errors.confirmPassword && isConfirmPasswordValid && (
            <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : "Register"}
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
          disabled={isSubmitting}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-xl text-red-500" />
          Register with google
        </button>
      </form>
    </div>
  );
};

export default Register;
