import React from "react";
import Marquee from "react-fast-marquee";

/// Import brand logos - adjust file names if needed
import casioLogo from "../assets/brands/casio.png";
import amazonLogo from "../assets/brands/amazon.png";
import amazonVector from "../assets/brands/amazon_vector.png";
import moonstarLogo from "../assets/brands/moonstar.png";
import starplusLogo from "../assets/brands/star.png";
import startpeopleLogo from "../assets/brands/start_people.png";
import randstadLogo from "../assets/brands/randstad.png";

const BrandsMarquee = () => {
  const brandLogos = [
    { id: 1, name: "Casio", src: casioLogo },
    { id: 2, name: "Amazon", src: amazonLogo },
    { id: 3, name: "Moonstar", src: moonstarLogo },
    { id: 4, name: "Star Plus", src: starplusLogo },
    { id: 5, name: "Start People", src: startpeopleLogo },
    { id: 6, name: "Randstad", src: randstadLogo },
    { id: 7, name: "Amazon Vector", src: amazonVector },
  ];

  return (
    <>
      <style>
        {`
          /* Prevent horizontal scrollbar for this section */
          body {
            overflow-x: hidden;
          }
        `}
      </style>
      <section className=" py-12 md:py-16 lg:py-20 overflow-hidden w-full max-w-full">
        <div className="container mx-auto px-4 md:px-6 overflow-hidden max-w-full">
          {/* Section Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1e3a4c] text-center mb-8 md:mb-12">
            We've helped thousands of sales teams
          </h2>

          {/* Marquee Wrapper */}
          <div className="overflow-hidden w-full max-w-full -mx-4 md:-mx-6">
            <Marquee
              gradient={true}
              gradientColor="rgb(249, 250, 251)"
              gradientWidth={100}
              speed={50}
              pauseOnHover={true}
              style={{ overflow: "hidden" }}
            >
              {brandLogos.map((brand) => (
                <div key={brand.id} className="mx-8 md:mx-12 lg:mx-16 flex-shrink-0">
                  <img
                    src={brand.src}
                    alt={brand.name}
                    className="h-8 md:h-10 lg:h-12 w-auto object-contain  hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandsMarquee;
