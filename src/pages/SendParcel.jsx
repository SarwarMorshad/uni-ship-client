import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

const SendParcel = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    setValue,
  } = useForm({
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      senderName: user?.displayName || "",
      type: "document",
    },
  });

  // Watch form values for cost calculation
  const watchType = watch("type");
  const watchWeight = watch("weight");
  const watchSenderRegion = watch("senderRegion");
  const watchSenderDistrict = watch("senderDistrict");
  const watchReceiverRegion = watch("receiverRegion");
  const watchReceiverDistrict = watch("receiverDistrict");

  // Watch all fields for validation
  const parcelName = watch("parcelName");
  const senderName = watch("senderName");
  const senderPhone = watch("senderPhone");
  const senderAddress = watch("senderAddress");
  const pickupInstruction = watch("pickupInstruction");
  const receiverName = watch("receiverName");
  const receiverPhone = watch("receiverPhone");
  const receiverAddress = watch("receiverAddress");
  const deliveryInstruction = watch("deliveryInstruction");

  // Validation status helpers
  const isParcelNameValid = parcelName && parcelName.length >= 3;
  const isWeightValid = watchWeight && parseFloat(watchWeight) >= 0.1;
  const isSenderNameValid = senderName && senderName.length >= 3;
  const isSenderPhoneValid = senderPhone && /^[0-9]{11}$/.test(senderPhone);
  const isSenderAddressValid = senderAddress && senderAddress.length >= 5;
  const isSenderRegionValid = watchSenderRegion && watchSenderRegion !== "";
  const isSenderDistrictValid = watchSenderDistrict && watchSenderDistrict !== "";
  const isPickupInstructionValid = pickupInstruction && pickupInstruction.length >= 10;
  const isReceiverNameValid = receiverName && receiverName.length >= 3;
  const isReceiverPhoneValid = receiverPhone && /^[0-9]{11}$/.test(receiverPhone);
  const isReceiverAddressValid = receiverAddress && receiverAddress.length >= 5;
  const isReceiverRegionValid = watchReceiverRegion && watchReceiverRegion !== "";
  const isReceiverDistrictValid = watchReceiverDistrict && watchReceiverDistrict !== "";
  const isDeliveryInstructionValid = deliveryInstruction && deliveryInstruction.length >= 10;

  // Load warehouses data
  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => {
        setWarehouses(data);
      })
      .catch((error) => {
        console.error("Error loading warehouses:", error);
        toast.error("Failed to load location data");
      });
  }, []);

  // Get unique regions
  const regions = [...new Set(warehouses.map((w) => w.region))];

  // Update sender districts when sender region changes
  useEffect(() => {
    if (watchSenderRegion) {
      const districts = warehouses
        .filter((w) => w.region === watchSenderRegion && w.status === "active")
        .map((w) => w.district);
      const uniqueDistricts = [...new Set(districts)];
      setSenderDistricts(uniqueDistricts);

      // Reset district selection when region changes
      setValue("senderDistrict", "");
    } else {
      setSenderDistricts([]);
    }
  }, [watchSenderRegion, warehouses, setValue]);

  // Update receiver districts when receiver region changes
  useEffect(() => {
    if (watchReceiverRegion) {
      const districts = warehouses
        .filter((w) => w.region === watchReceiverRegion && w.status === "active")
        .map((w) => w.district);
      const uniqueDistricts = [...new Set(districts)];
      setReceiverDistricts(uniqueDistricts);

      // Reset district selection when region changes
      setValue("receiverDistrict", "");
    } else {
      setReceiverDistricts([]);
    }
  }, [watchReceiverRegion, warehouses, setValue]);

  // Calculate cost when relevant fields change
  useEffect(() => {
    if (watchType && watchSenderDistrict && watchReceiverDistrict) {
      calculateCost();
    }
  }, [watchType, watchWeight, watchSenderDistrict, watchReceiverDistrict]);

  // Cost calculation logic
  const calculateCost = () => {
    let baseCost = 0;

    // Determine if it's within city or outside city/district
    const isWithinCity = watchSenderDistrict === watchReceiverDistrict;

    if (watchType === "document") {
      // Document pricing
      if (isWithinCity) {
        baseCost = 60; // Within City
      } else {
        baseCost = 80; // Outside City/District
      }
    } else {
      // Non-Document pricing
      const weight = parseFloat(watchWeight) || 0;

      if (weight <= 3) {
        // Up to 3kg
        if (isWithinCity) {
          baseCost = 110; // Within City
        } else {
          baseCost = 150; // Outside City/District
        }
      } else {
        // More than 3kg
        if (isWithinCity) {
          baseCost = 110 + (weight - 3) * 40; // Base + ৳40/kg for extra weight
        } else {
          baseCost = 150 + (weight - 3) * 40 + 40; // Base + ৳40/kg + ৳40 extra
        }
      }
    }

    setEstimatedCost(baseCost);
  };

  // Handle form submission
  const onSubmit = (data) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    const toastId = toast.loading("Creating parcel...");

    try {
      const parcelData = {
        ...formData,
        cost: estimatedCost,
        senderEmail: user?.email,
      };

      console.log("Parcel Data:", parcelData);

      // Save to database using axios
      const response = await axios.post("/parcels", parcelData);

      if (response.data.success) {
        toast.success("Parcel created successfully! 🎉", { id: toastId });
        setShowConfirmModal(false);

        // Reset form or redirect to parcels page
        // navigate('/parcels-to-pay');
      } else {
        throw new Error(response.data.message || "Failed to create parcel");
      }
    } catch (error) {
      console.error("Error creating parcel:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create parcel. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a4c] mb-2">Send A Parcel</h1>
          <p className="text-gray-600 text-lg">Enter your parcel details</p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm p-8">
          {/* Parcel Type Selection */}
          <div className="mb-8">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="document"
                  {...register("type")}
                  className="w-5 h-5 text-[#caeb66] focus:ring-[#caeb66] focus:ring-2"
                />
                <span className="text-gray-900 font-medium">Document</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="non-document"
                  {...register("type")}
                  className="w-5 h-5 text-[#caeb66] focus:ring-[#caeb66] focus:ring-2"
                />
                <span className="text-gray-900 font-medium">Non-Document</span>
              </label>
            </div>
          </div>

          {/* Parcel Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="parcelName" className="block text-gray-900 font-medium mb-2">
                Parcel Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="parcelName"
                  {...register("parcelName", {
                    required: "Parcel name is required",
                    minLength: { value: 3, message: "Parcel name must be at least 3 characters" },
                  })}
                  placeholder="Parcel Name"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.parcelName
                      ? "border-red-500"
                      : touchedFields.parcelName && isParcelNameValid
                      ? "border-green-500"
                      : "border-gray-300"
                  } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                />
                {touchedFields.parcelName && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isParcelNameValid ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {errors.parcelName && <p className="mt-1 text-sm text-red-600">{errors.parcelName.message}</p>}
            </div>

            <div>
              <label htmlFor="weight" className="block text-gray-900 font-medium mb-2">
                Parcel Weight (KG)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  id="weight"
                  {...register("weight", {
                    required: "Weight is required",
                    min: { value: 0.1, message: "Weight must be at least 0.1 kg" },
                  })}
                  placeholder="Parcel Weight (KG)"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                    errors.weight
                      ? "border-red-500"
                      : touchedFields.weight && isWeightValid
                      ? "border-green-500"
                      : "border-gray-300"
                  } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                />
                {touchedFields.weight && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isWeightValid ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>}
            </div>
          </div>

          {/* Two Column Layout for Sender and Receiver */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sender Details */}
            <div>
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-6">Sender Details</h2>

              <div className="space-y-4">
                {/* Sender Name */}
                <div>
                  <label htmlFor="senderName" className="block text-gray-900 font-medium mb-2">
                    Sender Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="senderName"
                      {...register("senderName", {
                        required: "Sender name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters" },
                      })}
                      placeholder="Sender Name"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.senderName
                          ? "border-red-500"
                          : touchedFields.senderName && isSenderNameValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.senderName && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isSenderNameValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.senderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.senderName.message}</p>
                  )}
                </div>

                {/* Sender Address */}
                <div>
                  <label htmlFor="senderAddress" className="block text-gray-900 font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="senderAddress"
                      {...register("senderAddress", {
                        required: "Address is required",
                        minLength: { value: 5, message: "Address must be at least 5 characters" },
                      })}
                      placeholder="Address"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.senderAddress
                          ? "border-red-500"
                          : touchedFields.senderAddress && isSenderAddressValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.senderAddress && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isSenderAddressValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.senderAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.senderAddress.message}</p>
                  )}
                </div>

                {/* Sender Phone */}
                <div>
                  <label htmlFor="senderPhone" className="block text-gray-900 font-medium mb-2">
                    Sender Phone No
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="senderPhone"
                      {...register("senderPhone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: "Phone number must be 11 digits",
                        },
                      })}
                      placeholder="Sender Phone No"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.senderPhone
                          ? "border-red-500"
                          : touchedFields.senderPhone && isSenderPhoneValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.senderPhone && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isSenderPhoneValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.senderPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.senderPhone.message}</p>
                  )}
                </div>

                {/* Sender Region */}
                <div>
                  <label htmlFor="senderRegion" className="block text-gray-900 font-medium mb-2">
                    Your Region
                  </label>
                  <div className="relative">
                    <select
                      id="senderRegion"
                      {...register("senderRegion", { required: "Region is required" })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.senderRegion
                          ? "border-red-500"
                          : touchedFields.senderRegion && isSenderRegionValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none bg-white`}
                    >
                      <option value="">Select your Region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {touchedFields.senderRegion && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isSenderRegionValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.senderRegion && (
                    <p className="mt-1 text-sm text-red-600">{errors.senderRegion.message}</p>
                  )}
                </div>

                {/* Sender District */}
                <div>
                  <label htmlFor="senderDistrict" className="block text-gray-900 font-medium mb-2">
                    Your District
                  </label>
                  <div className="relative">
                    <select
                      id="senderDistrict"
                      {...register("senderDistrict", { required: "District is required" })}
                      disabled={!watchSenderRegion || senderDistricts.length === 0}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.senderDistrict
                          ? "border-red-500"
                          : touchedFields.senderDistrict && isSenderDistrictValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select your District</option>
                      {senderDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {touchedFields.senderDistrict &&
                      !(!watchSenderRegion || senderDistricts.length === 0) && (
                        <span className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isSenderDistrictValid ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                        </span>
                      )}
                  </div>
                  {errors.senderDistrict && (
                    <p className="mt-1 text-sm text-red-600">{errors.senderDistrict.message}</p>
                  )}
                </div>

                {/* Pickup Instruction */}
                <div>
                  <label htmlFor="pickupInstruction" className="block text-gray-900 font-medium mb-2">
                    Pickup Instruction
                  </label>
                  <div className="relative">
                    <textarea
                      id="pickupInstruction"
                      rows="4"
                      {...register("pickupInstruction", {
                        required: "Pickup instruction is required",
                        minLength: { value: 10, message: "Instruction must be at least 10 characters" },
                      })}
                      placeholder="Pickup Instruction"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.pickupInstruction
                          ? "border-red-500"
                          : touchedFields.pickupInstruction && isPickupInstructionValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none resize-none`}
                    />
                    {touchedFields.pickupInstruction && (
                      <span className="absolute right-4 top-4">
                        {isPickupInstructionValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.pickupInstruction && (
                    <p className="mt-1 text-sm text-red-600">{errors.pickupInstruction.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Receiver Details */}
            <div>
              <h2 className="text-xl font-bold text-[#1e3a4c] mb-6">Receiver Details</h2>

              <div className="space-y-4">
                {/* Receiver Name */}
                <div>
                  <label htmlFor="receiverName" className="block text-gray-900 font-medium mb-2">
                    Receiver Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="receiverName"
                      {...register("receiverName", {
                        required: "Receiver name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters" },
                      })}
                      placeholder="Receiver Name"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.receiverName
                          ? "border-red-500"
                          : touchedFields.receiverName && isReceiverNameValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.receiverName && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isReceiverNameValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.receiverName && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverName.message}</p>
                  )}
                </div>

                {/* Receiver Address */}
                <div>
                  <label htmlFor="receiverAddress" className="block text-gray-900 font-medium mb-2">
                    Receiver Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="receiverAddress"
                      {...register("receiverAddress", {
                        required: "Address is required",
                        minLength: { value: 5, message: "Address must be at least 5 characters" },
                      })}
                      placeholder="Receiver Address"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.receiverAddress
                          ? "border-red-500"
                          : touchedFields.receiverAddress && isReceiverAddressValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.receiverAddress && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isReceiverAddressValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.receiverAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverAddress.message}</p>
                  )}
                </div>

                {/* Receiver Phone */}
                <div>
                  <label htmlFor="receiverPhone" className="block text-gray-900 font-medium mb-2">
                    Receiver Contact No
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="receiverPhone"
                      {...register("receiverPhone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{11}$/,
                          message: "Phone number must be 11 digits",
                        },
                      })}
                      placeholder="Receiver Contact No"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.receiverPhone
                          ? "border-red-500"
                          : touchedFields.receiverPhone && isReceiverPhoneValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none`}
                    />
                    {touchedFields.receiverPhone && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isReceiverPhoneValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.receiverPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverPhone.message}</p>
                  )}
                </div>

                {/* Receiver Region */}
                <div>
                  <label htmlFor="receiverRegion" className="block text-gray-900 font-medium mb-2">
                    Receiver Region
                  </label>
                  <div className="relative">
                    <select
                      id="receiverRegion"
                      {...register("receiverRegion", { required: "Region is required" })}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.receiverRegion
                          ? "border-red-500"
                          : touchedFields.receiverRegion && isReceiverRegionValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none bg-white`}
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    {touchedFields.receiverRegion && (
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isReceiverRegionValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.receiverRegion && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverRegion.message}</p>
                  )}
                </div>

                {/* Receiver District */}
                <div>
                  <label htmlFor="receiverDistrict" className="block text-gray-900 font-medium mb-2">
                    Receiver District
                  </label>
                  <div className="relative">
                    <select
                      id="receiverDistrict"
                      {...register("receiverDistrict", { required: "District is required" })}
                      disabled={!watchReceiverRegion || receiverDistricts.length === 0}
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.receiverDistrict
                          ? "border-red-500"
                          : touchedFields.receiverDistrict && isReceiverDistrictValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select District</option>
                      {receiverDistricts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    {touchedFields.receiverDistrict &&
                      !(!watchReceiverRegion || receiverDistricts.length === 0) && (
                        <span className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                          {isReceiverDistrictValid ? (
                            <FaCheck className="text-green-500" />
                          ) : (
                            <FaTimes className="text-red-500" />
                          )}
                        </span>
                      )}
                  </div>
                  {errors.receiverDistrict && (
                    <p className="mt-1 text-sm text-red-600">{errors.receiverDistrict.message}</p>
                  )}
                </div>

                {/* Delivery Instruction */}
                <div>
                  <label htmlFor="deliveryInstruction" className="block text-gray-900 font-medium mb-2">
                    Delivery Instruction
                  </label>
                  <div className="relative">
                    <textarea
                      id="deliveryInstruction"
                      rows="4"
                      {...register("deliveryInstruction", {
                        required: "Delivery instruction is required",
                        minLength: { value: 10, message: "Instruction must be at least 10 characters" },
                      })}
                      placeholder="Delivery Instruction"
                      className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                        errors.deliveryInstruction
                          ? "border-red-500"
                          : touchedFields.deliveryInstruction && isDeliveryInstructionValid
                          ? "border-green-500"
                          : "border-gray-300"
                      } focus:border-[#caeb66] focus:ring-2 focus:ring-[#caeb66]/20 focus:outline-none resize-none`}
                    />
                    {touchedFields.deliveryInstruction && (
                      <span className="absolute right-4 top-4">
                        {isDeliveryInstructionValid ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                  {errors.deliveryInstruction && (
                    <p className="mt-1 text-sm text-red-600">{errors.deliveryInstruction.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Time Note */}
          <div className="mt-8 mb-6">
            <p className="text-gray-600 text-sm">* PickUp Time 4pm-7pm Approx.</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Proceed to Confirm Booking
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-[#1e3a4c] mb-4">Confirm Booking</h3>

            <div className="mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Parcel Type:</span>
                <span className="font-semibold text-gray-900 capitalize">{formData?.type}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">From:</span>
                <span className="font-semibold text-gray-900">
                  {formData?.senderRegion}, {formData?.senderDistrict}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">To:</span>
                <span className="font-semibold text-gray-900">
                  {formData?.receiverRegion}, {formData?.receiverDistrict}
                </span>
              </div>
              <div className="flex justify-between items-center py-4 bg-[#caeb66]/20 rounded-lg px-4 mt-4">
                <span className="text-gray-900 font-bold text-lg">Delivery Cost:</span>
                <span className="font-bold text-2xl text-[#1e3a4c]">৳{estimatedCost}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-[#caeb66] hover:bg-[#b8d959] text-gray-900 font-bold rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendParcel;
