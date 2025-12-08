import React from "react";

// Import feature images - adjust paths based on your actual file names
import trackingImg from "../assets/live-tracking.png";
import safeDeliveryImg from "../assets/safe-delivery.png";
import supportImg from "../assets/247.jpg";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      image: trackingImg,
      title: "Live Parcel Tracking",
      description:
        "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    },
    {
      id: 2,
      image: safeDeliveryImg,
      title: "100% Safe Delivery",
      description:
        "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    },
    {
      id: 3,
      image: supportImg,
      title: "24/7 Call Center Support",
      description:
        "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Features List */}
        <div className="space-y-6 md:space-y-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] items-center">
                {/* Left - Image */}
                <div className="p-8 md:p-12 flex items-center justify-center bg-gray-50">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full max-w-[250px] h-auto object-contain"
                  />
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block absolute left-[300px] lg:left-[400px] top-0 bottom-0 w-px bg-gray-200"></div>

                {/* Right - Content */}
                <div className="p-8 md:p-12 md:pl-16 lg:pl-20">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a4c] mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
