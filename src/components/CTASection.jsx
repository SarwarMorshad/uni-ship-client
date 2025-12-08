import React from "react";

// Import the delivery illustration - adjust path based on your file
import deliveryIllustration from "../assets/location-merchant.png";

const CTASection = () => {
  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* CTA Card */}
        <div className="bg-[#1e3a4c] rounded-3xl overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
            {/* Left - Content */}
            <div className="space-y-6 md:space-y-8 z-10 relative">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Merchant and Customer Satisfaction is Our First Priority
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                We offer the lowest delivery charge with the highest value along with 100% safety of your
                product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-6 md:px-8 py-3 md:py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                  Become a Merchant
                </button>
                <button className="px-6 md:px-8 py-3 md:py-4 bg-transparent hover:bg-white/10 text-[#caeb66] font-bold rounded-full border-2 border-[#caeb66] transition-all duration-300">
                  Earn with ZapShift Courier
                </button>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="relative hidden md:flex items-center justify-center">
              <img
                src={deliveryIllustration}
                alt="Delivery illustration"
                className="w-full max-w-[500px] h-auto object-contain opacity-80"
              />
            </div>
          </div>

          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 200 Q150 100 300 200 T600 200"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#caeb66]"
              />
              <path
                d="M0 250 Q150 150 300 250 T600 250"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#caeb66]"
              />
              <path
                d="M0 150 Q150 50 300 150 T600 150"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[#caeb66]"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
