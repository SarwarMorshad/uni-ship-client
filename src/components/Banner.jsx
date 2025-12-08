import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import banner images
import banner1 from "../assets/banner/banner1.png";
import banner2 from "../assets/banner/banner2.png";
import banner3 from "../assets/banner/banner3.png";

const Banner = () => {
  const banners = [
    { id: 1, image: banner1 },
    { id: 2, image: banner2 },
    { id: 3, image: banner3 },
  ];

  return (
    <section className="bg-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <style>
          {`
            .banner-swiper {
              padding-bottom: 50px;
            }
            
            .banner-swiper .swiper-button-next,
            .banner-swiper .swiper-button-prev {
              color: #1e3a4c;
              background: white;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .banner-swiper .swiper-button-next:after,
            .banner-swiper .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            
            .banner-swiper .swiper-pagination-bullet {
              width: 12px;
              height: 12px;
              background: #d1d5db;
              opacity: 1;
            }
            
            .banner-swiper .swiper-pagination-bullet-active {
              background: #caeb66;
              width: 30px;
              border-radius: 6px;
            }

            @media (max-width: 768px) {
              .banner-swiper .swiper-button-next,
              .banner-swiper .swiper-button-prev {
                width: 40px;
                height: 40px;
              }
              
              .banner-swiper .swiper-button-next:after,
              .banner-swiper .swiper-button-prev:after {
                font-size: 16px;
              }
            }
          `}
        </style>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="banner-swiper"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
                {/* Banner Image */}
                <img src={banner.image} alt={`Banner ${banner.id}`} className="w-full h-auto object-cover" />

                {/* Overlay Buttons */}
                <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 flex flex-wrap gap-4 items-center z-10">
                  <button className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-[#caeb66] hover:bg-[#b8d959] text-gray-800 font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                    Track Your Parcel
                    <span className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </button>
                  <button className="px-6 md:px-8 py-3 md:py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full border-2 border-gray-300 transition-all duration-300 shadow-md">
                    Be A Rider
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banner;
