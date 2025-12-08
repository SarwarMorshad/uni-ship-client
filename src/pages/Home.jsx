import React from "react";
import Banner from "../components/Banner";
import HowItWorks from "../components/HowItWorks";
import OurServices from "../components/OurServices";
import BrandsMarquee from "../components/BrandsMarquee";
import WhyChooseUs from "../components/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <Banner />
      <HowItWorks />
      <OurServices />
      <BrandsMarquee />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
