import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import riderImage from "../assets/agent-pending.png"; // Update path as needed

const BeARider = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    const toastId = toast.loading("Submitting your application...");

    try {
      console.log("Rider Application Data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application submitted successfully! We'll contact you soon. 🎉", {
        id: toastId,
        duration: 4000,
      });

      reset(); // Reset form after successful submission
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">Be a Rider</h1>
          <p className="text-gray-600 text-lg max-w-3xl">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal
            packages to business shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a4c] mb-6">Tell us about yourself</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Your Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-900 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    })}
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Driving License Number */}
                <div>
                  <label htmlFor="drivingLicense" className="block text-gray-900 font-medium mb-2">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    id="drivingLicense"
                    {...register("drivingLicense", {
                      required: "Driving license number is required",
                    })}
                    placeholder="Driving License Number"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.drivingLicense
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.drivingLicense && (
                    <p className="mt-1 text-sm text-red-600">{errors.drivingLicense.message}</p>
                  )}
                </div>

                {/* Your Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                    Your Email
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
                    placeholder="Your Email"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                {/* Your Region */}
                <div>
                  <label htmlFor="region" className="block text-gray-900 font-medium mb-2">
                    Your Region
                  </label>
                  <select
                    id="region"
                    {...register("region", {
                      required: "Please select your region",
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.region
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 bg-white`}
                  >
                    <option value="">Select your Region</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                  {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>}
                </div>

                {/* Your District */}
                <div>
                  <label htmlFor="district" className="block text-gray-900 font-medium mb-2">
                    Your District
                  </label>
                  <select
                    id="district"
                    {...register("district", {
                      required: "Please select your district",
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.district
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 bg-white`}
                  >
                    <option value="">Select your District</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Gazipur">Gazipur</option>
                    <option value="Narayanganj">Narayanganj</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Comilla">Comilla</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                  {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>}
                </div>

                {/* NID No */}
                <div>
                  <label htmlFor="nid" className="block text-gray-900 font-medium mb-2">
                    NID No
                  </label>
                  <input
                    type="text"
                    id="nid"
                    {...register("nid", {
                      required: "NID number is required",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "NID must contain only numbers",
                      },
                    })}
                    placeholder="NID"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.nid
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.nid && <p className="mt-1 text-sm text-red-600">{errors.nid.message}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-gray-900 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must be 11 digits",
                      },
                    })}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                {/* Bike Brand Model and Year */}
                <div>
                  <label htmlFor="bikeModel" className="block text-gray-900 font-medium mb-2">
                    Bike Brand Model and Year
                  </label>
                  <input
                    type="text"
                    id="bikeModel"
                    {...register("bikeModel", {
                      required: "Bike details are required",
                    })}
                    placeholder="Bike Brand Model and Year"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.bikeModel
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.bikeModel && (
                    <p className="mt-1 text-sm text-red-600">{errors.bikeModel.message}</p>
                  )}
                </div>

                {/* Bike Registration Number */}
                <div>
                  <label htmlFor="bikeRegistration" className="block text-gray-900 font-medium mb-2">
                    Bike Registration Number
                  </label>
                  <input
                    type="text"
                    id="bikeRegistration"
                    {...register("bikeRegistration", {
                      required: "Bike registration number is required",
                    })}
                    placeholder="Bike Registration Number"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.bikeRegistration
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400`}
                  />
                  {errors.bikeRegistration && (
                    <p className="mt-1 text-sm text-red-600">{errors.bikeRegistration.message}</p>
                  )}
                </div>

                {/* Tell Us About Yourself */}
                <div>
                  <label htmlFor="about" className="block text-gray-900 font-medium mb-2">
                    Tell Us About Yourself
                  </label>
                  <textarea
                    id="about"
                    rows="4"
                    {...register("about", {
                      required: "Please tell us about yourself",
                      minLength: {
                        value: 20,
                        message: "Please provide at least 20 characters",
                      },
                    })}
                    placeholder="Tell Us About Yourself"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.about
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-[#caeb66]"
                    } focus:outline-none focus:ring-2 focus:ring-[#caeb66]/20 text-gray-900 placeholder-gray-400 resize-none`}
                  />
                  {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>

            {/* Image Section */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-[#f0f9f4] to-[#e8f5e9] p-12">
              <div className="w-full max-w-lg">
                <img src={riderImage} alt="Delivery Rider" className="w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARider;
