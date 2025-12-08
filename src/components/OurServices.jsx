import React from "react";
import {
  FaShippingFast,
  FaGlobeAmericas,
  FaBoxOpen,
  FaMoneyBillWave,
  FaBuilding,
  FaUndo,
} from "react-icons/fa";

const OurServices = () => {
  const services = [
    {
      id: 1,
      icon: <FaShippingFast className="text-5xl text-pink-400" />,
      title: "Express & Standard Delivery",
      description:
        "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    },
    {
      id: 2,
      icon: <FaGlobeAmericas className="text-5xl text-pink-400" />,
      title: "Nationwide Delivery",
      description:
        "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    },
    {
      id: 3,
      icon: <FaBoxOpen className="text-5xl text-pink-400" />,
      title: "Fulfillment Solution",
      description:
        "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    },
    {
      id: 4,
      icon: <FaMoneyBillWave className="text-5xl text-pink-400" />,
      title: "Cash on Home Delivery",
      description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    },
    {
      id: 5,
      icon: <FaBuilding className="text-5xl text-pink-400" />,
      title: "Corporate Service / Contract In Logistics",
      description: "Customized corporate services which includes warehouse and inventory management support.",
    },
    {
      id: 6,
      icon: <FaUndo className="text-5xl text-pink-400" />,
      title: "Parcel Return",
      description:
        "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    },
  ];

  return (
    <section className=" py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Dark Background Container */}
        <div className="bg-[#1e3a4c] rounded-3xl p-8 md:p-12 lg:p-16">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-300 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal
              packages to business shipments — we deliver on time, every time.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white hover:bg-[#caeb66] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
              >
                {/* Icon */}
                <div className="w-20 h-20 bg-gray-100 group-hover:bg-white/30 rounded-full flex items-center justify-center mb-6 transition-all duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-[#1e3a4c] mb-4">{service.title}</h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 group-hover:text-gray-700 leading-relaxed transition-all duration-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
