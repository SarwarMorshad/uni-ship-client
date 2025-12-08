import React from "react";
import Banner from "../components/Banner";
import HowItWorks from "../components/HowItWorks";
import OurServices from "../components/OurServices";
import BrandsMarquee from "../components/BrandsMarquee";
import WhyChooseUs from "../components/WhyChooseUs";
import CTASection from "../components/CTASection";
import FAQ from "../components/FAQ";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <OurServices />
      <BrandsMarquee />
      <WhyChooseUs />
      <CTASection />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
