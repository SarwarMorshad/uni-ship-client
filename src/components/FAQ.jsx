import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaArrowRight } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  const faqs = [
    {
      id: 1,
      question: "How does this posture corrector work?",
      answer:
        "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
    },
    {
      id: 2,
      question: "Is it suitable for all ages and body types?",
      answer:
        "Yes, our delivery service is suitable for all types of businesses and individuals. Whether you're sending small personal packages or bulk business shipments, we have solutions tailored to your needs. Our flexible service adapts to various requirements and scales with your business.",
    },
    {
      id: 3,
      question: "Does it really help with back pain and posture improvement?",
      answer:
        "Absolutely! Our reliable delivery system ensures your parcels are handled with care throughout the entire journey. We use advanced tracking technology and trained professionals to maintain the safety and integrity of your packages from pickup to delivery.",
    },
    {
      id: 4,
      question: "Does it have smart features like vibration alerts?",
      answer:
        "Yes, we offer smart tracking features including real-time notifications, delivery alerts, and GPS tracking. You'll receive instant updates via SMS and email at every stage of your parcel's journey, ensuring you're always informed about your shipment's status.",
    },
    {
      id: 5,
      question: "How will I be notified when the product is back in stock?",
      answer:
        "You can subscribe to our notification system to receive instant alerts when services or features become available. Simply provide your email or phone number, and we'll notify you immediately when the service you're interested in is ready for use.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment,
            reduce pain, and strengthen your body with ease!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-5xl mx-auto space-y-4 mb-10">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`rounded-2xl transition-all duration-300 ${
                openIndex === index
                  ? "bg-[#e8f5e9] border-2 border-primary"
                  : "bg-white border-2 border-transparent hover:border-gray-200"
              }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className="text-lg md:text-xl font-bold text-[#1e3a4c] pr-4">{faq.question}</span>
                <span className="flex-shrink-0 text-[#1e3a4c]">
                  {openIndex === index ? (
                    <FaChevronUp className="text-xl" />
                  ) : (
                    <FaChevronDown className="text-xl" />
                  )}
                </span>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="flex justify-center">
          <button className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-primary hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl group">
            See More FAQ's
            <span className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <FaArrowRight className="text-white text-sm" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
