import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from public folder
  useEffect(() => {
    fetch("/reviews.json")
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  }, []);

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <section className="bg-gray-100 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 max-w-4xl mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-20 h-20 text-teal-600"
              viewBox="0 0 100 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {/* Boxes */}
                <rect x="10" y="40" width="20" height="20" />
                <rect x="35" y="30" width="20" height="30" />
                <rect x="60" y="25" width="20" height="35" />
                {/* Dolly */}
                <path d="M5 60 L15 60 L15 45 L25 45" />
                <circle cx="10" cy="65" r="3" fill="currentColor" />
              </g>
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a4c] mb-4">
            What our customers are sayings
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment,
            reduce pain, and strengthen your body with ease!
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonials-container relative max-w-7xl mx-auto px-8 md:px-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1.2}
            centeredSlides={true}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1.8,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 2.2,
                spaceBetween: 30,
              },
            }}
            className="testimonials-swiper pb-16"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                {({ isActive }) => (
                  <div
                    className={`bg-white rounded-3xl p-8 md:p-10 shadow-lg h-full transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <FaQuoteLeft className="text-4xl text-teal-200" />
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 min-h-[80px]">
                      {review.review}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {renderStars(review.ratings)}
                      <span className="ml-2 text-gray-600 font-semibold text-sm">
                        {review.ratings.toFixed(1)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-dashed border-gray-300 my-6"></div>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={review.user_photoURL}
                        alt={review.userName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-[#1e3a4c]">{review.userName}</h4>
                        <p className="text-gray-600 text-sm">{formatDate(review.date)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
            <FaChevronLeft className="text-xl text-[#1e3a4c]" />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#caeb66] hover:bg-[#b8d959] rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
            <FaChevronRight className="text-xl text-[#1e3a4c]" />
          </button>
        </div>
      </div>

      <style>
        {`
          .testimonials-swiper {
            padding: 20px 0 60px 0;
          }

          .testimonials-swiper .swiper-slide {
            height: auto;
            transition: opacity 0.3s ease;
          }
          
          .testimonials-swiper .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #d1d5db;
            opacity: 1;
          }
          
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: #1e3a4c;
            width: 10px;
          }

          @media (max-width: 767px) {
            .swiper-button-prev-custom,
            .swiper-button-next-custom {
              display: none;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;
